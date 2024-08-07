"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = exports.io = exports.rooms = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const node_http_1 = require("node:http");
const errors = __importStar(require("./errors.json"));
const three_1 = require("three");
const app = (0, express_1.default)();
exports.app = app;
const server = (0, node_http_1.createServer)(app);
exports.server = server;
const rooms = new Map();
exports.rooms = rooms;
const MAX_PLAYERS = Number(process.env.MAX_PLAYERS) || 50;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
exports.io = io;
const CheckRoomExists = (room) => {
    return rooms.has(room);
};
const JoinOrCrateRoom = (name, socket) => {
    let roomName = name;
    if (!name) {
        socket.emit("error", {
            code: 1000,
            message: errors[1000],
        });
        return;
    }
    if (!CheckRoomExists(roomName)) {
        rooms.set(roomName, {
            name: roomName,
            count: 0,
            max: MAX_PLAYERS,
            players: new Map(),
        });
        console.log(`Cliente ${socket.id} se ha unido a la sala ${roomName}`);
    }
    else {
        const room = rooms.get(roomName);
        const player = {
            id: socket.id,
            position: new three_1.Vector3(socket.handshake.query.modelUrl.position.x, socket.handshake.query.modelUrl.position.y, socket.handshake.query.modelUrl.position.z),
            rotation: new three_1.Quaternion(socket.handshake.query.modelUrl.rotation.x, socket.handshake.query.modelUrl.rotation.y, socket.handshake.query.modelUrl.rotation.z, socket.handshake.query.modelUrl.rotation.w),
            animation: "idle",
            name: socket.handshake.query.name,
            modelUrl: socket.handshake.query.modelUrl,
        };
        if (room) {
            if (room.count >= room.max) {
                socket.emit("error", {
                    code: 1002,
                    message: errors[1002],
                });
                return;
            }
            else {
                room.count++;
                room.players.set(socket.id, player);
                socket.join(roomName);
                console.log(`Cliente ${socket.id} se ha unido a la sala ${roomName}`);
            }
        }
        else {
            socket.emit("error", {
                code: 1001,
                message: errors[1001],
            });
            return;
        }
    }
};
const LeaveRoom = (room, socket) => {
    var _a, _b;
    if (CheckRoomExists(room)) {
        if ((_a = rooms.get(room)) === null || _a === void 0 ? void 0 : _a.players.has(socket.id)) {
            (_b = rooms.get(room)) === null || _b === void 0 ? void 0 : _b.players.delete(socket.id);
            socket.leave(room);
            console.log(`Cliente ${socket.id} ha dejado la sala ${room}`);
        }
    }
};
io.on("connection", function (socket) {
    console.log(`User connected: ${socket.id}`);
    socket.on("joinRoom", (room) => {
        JoinOrCrateRoom(room, socket);
    });
    socket.on("leaveRoom", (room) => {
        LeaveRoom(room, socket);
    });
    socket.on("move", (data) => {
        const room = rooms.get(data.room);
        if (room) {
            if (room.players.has(socket.id)) {
                const player = room.players.get(socket.id);
                if (player) {
                    player.position = new three_1.Vector3(data.position.x, data.position.y, data.position.z);
                    player.rotation = new three_1.Quaternion(data.rotation.x, data.rotation.y, data.rotation.z, data.rotation.w);
                    player.animation = data.animation;
                    room.players.set(socket.id, player);
                    socket.to(data.room).emit("move", player);
                }
            }
        }
    });
    socket.on("disconnect", function () {
        console.log(`User disconnected: ${socket.id}`);
        rooms.forEach((room) => {
            if (room.players.has(socket.id)) {
                room.players.delete(socket.id);
            }
        });
    });
});
//# sourceMappingURL=server.js.map
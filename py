import socket
import threading
import json
import time
import random

HOST = "0.0.0.0"
PORT = 5055
TICK = 0.12
ANCHO = 35
ALTO = 35

lock = threading.Lock()

game_state = {
    "players": {
        "p1": {
            "x": 8, "y": 17,
            "dir": "RIGHT",
            "body": [[8, 17], [7, 17], [6, 17]],
            "alive": True,
            "score": 0,
            "name": "Jugador 1",
            "is_ai": False,
        },
        "p2": {
            "x": 26, "y": 17,
            "dir": "LEFT",
            "body": [[26, 17], [27, 17], [28, 17]],
            "alive": True,
            "score": 0,
            "name": "Jugador 2",
            "is_ai": False,
        }
    },
    "food": [17, 10],
    "status": "waiting",  # waiting, playing, gameover
    "winner": "",
    "message": "Esperando jugador 2..."
}

clients = {}
player_slots = {"p1": None, "p2": None}
ai_enabled = False
server_started = time.time()

def send_json(conn, data):
    try:
        msg = json.dumps(data).encode("utf-8") + b"\n"
        conn.sendall(msg)
    except:
        pass

def recv_lines(conn, buffer):
    try:
        data = conn.recv(4096)
        if not data:
            return None, buffer
        buffer += data
        lines = []
        while b"\n" in buffer:
            line, buffer = buffer.split(b"\n", 1)
            if line.strip():
                lines.append(json.loads(line.decode("utf-8")))
        return lines, buffer
    except:
        return None, buffer

def random_food():
    while True:
        x = random.randint(1, ANCHO - 2)
        y = random.randint(1, ALTO - 2)
        occupied = set()
        for pid in ("p1", "p2"):
            for part in game_state["players"][pid]["body"]:
                occupied.add(tuple(part))
        if (x, y) not in occupied:
            return [x, y]

def next_pos(x, y, d):
    if d == "UP":
        return x, y + 1
    if d == "DOWN":
        return x, y - 1
    if d == "LEFT":
        return x - 1, y
    return x + 1, y

def opposite(d1, d2):
    pairs = {
        ("UP", "DOWN"), ("DOWN", "UP"),
        ("LEFT", "RIGHT"), ("RIGHT", "LEFT")
    }
    return (d1, d2) in pairs

def reset_game():
    global ai_enabled
    game_state["players"]["p1"].update({
        "x": 8, "y": 17, "dir": "RIGHT",
        "body": [[8, 17], [7, 17], [6, 17]],
        "alive": True, "score": 0,
    })
    game_state["players"]["p2"].update({
        "x": 26, "y": 17, "dir": "LEFT",
        "body": [[26, 17], [27, 17], [28, 17]],
        "alive": True, "score": 0,
    })
    game_state["food"] = random_food()
    game_state["winner"] = ""
    if player_slots["p2"] is None:
        ai_enabled = True
        game_state["players"]["p2"]["is_ai"] = True
        game_state["players"]["p2"]["name"] = "IA"
        game_state["message"] = "Jugando contra IA"
    else:
        ai_enabled = False
        game_state["players"]["p2"]["is_ai"] = False
        game_state["players"]["p2"]["name"] = "Jugador 2"
        game_state["message"] = "Partida online"
    game_state["status"] = "playing"

def assign_player(conn):
    with lock:
        if player_slots["p1"] is None:
            player_slots["p1"] = conn
            clients[conn] = "p1"
            return "p1"
        elif player_slots["p2"] is None:
            player_slots["p2"] = conn
            clients[conn] = "p2"
            game_state["players"]["p2"]["is_ai"] = False
            game_state["players"]["p2"]["name"] = "Jugador 2"
            return "p2"
        return None

def remove_client(conn):
    global ai_enabled
    with lock:
        pid = clients.get(conn)
        if pid:
            if player_slots[pid] == conn:
                player_slots[pid] = None
            del clients[conn]

        if pid == "p2" and game_state["status"] == "playing":
            ai_enabled = True
            game_state["players"]["p2"]["is_ai"] = True
            game_state["players"]["p2"]["name"] = "IA"
            game_state["message"] = "Jugador 2 salió. Entró IA."
        elif pid == "p1":
            game_state["status"] = "waiting"
            game_state["message"] = "Esperando jugador 1..."

def handle_client(conn, addr):
    pid = assign_player(conn)
    if not pid:
        send_json(conn, {"type": "error", "message": "Servidor lleno"})
        conn.close()
        return

    send_json(conn, {"type": "welcome", "player_id": pid})
    if pid == "p1":
        game_state["message"] = "Esperando jugador 2 o IA..."
    elif pid == "p2":
        if game_state["status"] != "playing":
            reset_game()

    buffer = b""
    try:
        while True:
            msgs, buffer = recv_lines(conn, buffer)
            if msgs is None:
                break

            for msg in msgs:
                if msg.get("type") == "input":
                    direction = msg.get("direction")
                    with lock:
                        player = game_state["players"].get(pid)
                        if player and player["alive"] and direction and not opposite(player["dir"], direction):
                            player["dir"] = direction

                elif msg.get("type") == "restart":
                    with lock:
                        reset_game()
    finally:
        remove_client(conn)
        try:
            conn.close()
        except:
            pass

def ai_choose_direction():
    p2 = game_state["players"]["p2"]
    food_x, food_y = game_state["food"]
    x, y = p2["x"], p2["y"]

    options = ["UP", "DOWN", "LEFT", "RIGHT"]
    safe = []

    occupied = set()
    for pid in ("p1", "p2"):
        for part in game_state["players"][pid]["body"]:
            occupied.add(tuple(part))

    for d in options:
        if opposite(p2["dir"], d):
            continue
        nx, ny = next_pos(x, y, d)
        if nx <= 0 or nx >= ANCHO - 1 or ny <= 0 or ny >= ALTO - 1:
            continue
        if (nx, ny) in occupied:
            continue
        dist = abs(nx - food_x) + abs(ny - food_y)
        safe.append((dist, d))

    if safe:
        safe.sort(key=lambda t: t[0])
        p2["dir"] = safe[0][1]

def step_player(pid):
    player = game_state["players"][pid]
    if not player["alive"]:
        return

    nx, ny = next_pos(player["x"], player["y"], player["dir"])

    if nx <= 0 or nx >= ANCHO - 1 or ny <= 0 or ny >= ALTO - 1:
        player["alive"] = False
        return

    occupied = set()
    for other_pid in ("p1", "p2"):
        for part in game_state["players"][other_pid]["body"]:
            occupied.add(tuple(part))

    if (nx, ny) in occupied:
        player["alive"] = False
        return

    player["body"].insert(0, [nx, ny])
    player["x"], player["y"] = nx, ny

    if [nx, ny] == game_state["food"]:
        player["score"] += 1
        game_state["food"] = random_food()
    else:
        player["body"].pop()

def update_game():
    global ai_enabled
    while True:
        time.sleep(TICK)
        with lock:
            if game_state["status"] == "waiting":
                if player_slots["p1"] is not None:
                    if player_slots["p2"] is not None:
                        reset_game()
                    elif time.time() - server_started > 5:
                        ai_enabled = True
                        game_state["players"]["p2"]["is_ai"] = True
                        game_state["players"]["p2"]["name"] = "IA"
                        reset_game()

            elif game_state["status"] == "playing":
                if ai_enabled and game_state["players"]["p2"]["alive"]:
                    ai_choose_direction()

                step_player("p1")
                step_player("p2")

                p1_alive = game_state["players"]["p1"]["alive"]
                p2_alive = game_state["players"]["p2"]["alive"]

                if not p1_alive and not p2_alive:
                    game_state["status"] = "gameover"
                    game_state["winner"] = "Empate"
                    game_state["message"] = "Empate"
                elif not p1_alive:
                    game_state["status"] = "gameover"
                    game_state["winner"] = game_state["players"]["p2"]["name"]
                    game_state["message"] = f"Gana {game_state['players']['p2']['name']}"
                elif not p2_alive:
                    game_state["status"] = "gameover"
                    game_state["winner"] = game_state["players"]["p1"]["name"]
                    game_state["message"] = "Gana Jugador 1"

def broadcast_loop():
    while True:
        time.sleep(0.03)
        with lock:
            payload = {
                "type": "state",
                "state": game_state
            }
            conns = list(clients.keys())

        for conn in conns:
            send_json(conn, payload)

def main():
    threading.Thread(target=update_game, daemon=True).start()
    threading.Thread(target=broadcast_loop, daemon=True).start()

    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((HOST, PORT))
    server.listen()
    print(f"Servidor escuchando en {HOST}:{PORT}")
    print("Si no entra jugador 2, se activa una IA.")

    while True:
        conn, addr = server.accept()
        print("Conectado:", addr)
        threading.Thread(target=handle_client, args=(conn, addr), daemon=True).start()

if __name__ == "__main__":
    main()
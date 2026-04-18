import turtle
import random
import time
import os

# =========================
# CONFIGURACIÓN
# =========================
ANCHO = 600
ALTO = 600
MOVIMIENTO = 20
DELAY_INICIAL = 0.12
ARCHIVO_RECORD = "record.txt"

# Estados
estado = "menu"   # menu, jugando, pausa, gameover
direccion = "Right"
delay = DELAY_INICIAL
puntaje = 0
record = 0
nivel = 1
skin_actual = 0

skins = [
    {"nombre": "Clásica", "cabeza": "lime", "cuerpo": "green"},
    {"nombre": "Azul", "cabeza": "deepskyblue", "cuerpo": "blue"},
    {"nombre": "Fuego", "cabeza": "orange", "cuerpo": "red"},
    {"nombre": "Morada", "cabeza": "violet", "cuerpo": "purple"},
]

segmentos = []
obstaculos = []
particulas = []


# =========================
# RECORD
# =========================
def cargar_record():
    global record
    if os.path.exists(ARCHIVO_RECORD):
        try:
            with open(ARCHIVO_RECORD, "r", encoding="utf-8") as f:
                record = int(f.read().strip())
        except:
            record = 0
    else:
        record = 0


def guardar_record():
    try:
        with open(ARCHIVO_RECORD, "w", encoding="utf-8") as f:
            f.write(str(record))
    except:
        pass


# =========================
# VENTANA
# =========================
wn = turtle.Screen()
wn.title("Snake sin instalar nada")
wn.bgcolor("black")
wn.setup(width=ANCHO, height=ALTO)
wn.tracer(0)

# =========================
# FONDO ANIMADO
# =========================
for _ in range(25):
    p = turtle.Turtle()
    p.speed(0)
    p.shape("circle")
    p.color("midnight blue")
    p.penup()
    p.shapesize(0.2, 0.2)
    p.goto(random.randint(-290, 290), random.randint(-290, 290))
    particulas.append(p)

# =========================
# CABEZA
# =========================
cabeza = turtle.Turtle()
cabeza.speed(0)
cabeza.shape("square")
cabeza.color(skins[skin_actual]["cabeza"])
cabeza.penup()
cabeza.goto(0, 0)
cabeza.direction = "stop"

# =========================
# COMIDA / MANZANA
# =========================
comida = turtle.Turtle()
comida.speed(0)
comida.shape("circle")
comida.color("red")
comida.penup()
comida.goto(0, 100)

# hojita visual
hoja = turtle.Turtle()
hoja.speed(0)
hoja.shape("circle")
hoja.color("green")
hoja.penup()
hoja.shapesize(0.3, 0.3)
hoja.goto(8, 112)

# =========================
# TEXTO
# =========================
lapiz = turtle.Turtle()
lapiz.speed(0)
lapiz.color("white")
lapiz.penup()
lapiz.hideturtle()

mensaje = turtle.Turtle()
mensaje.speed(0)
mensaje.color("white")
mensaje.penup()
mensaje.hideturtle()

# =========================
# FUNCIONES
# =========================
def actualizar_skin():
    cabeza.color(skins[skin_actual]["cabeza"])
    for s in segmentos:
        s.color(skins[skin_actual]["cuerpo"])


def actualizar_marcador():
    lapiz.clear()
    lapiz.goto(0, 260)
    lapiz.write(
        f"Puntaje: {puntaje}   Récord: {record}   Nivel: {nivel}   Skin: {skins[skin_actual]['nombre']}",
        align="center",
        font=("Arial", 14, "bold")
    )


def mostrar_menu():
    mensaje.clear()
    mensaje.goto(0, 120)
    mensaje.write("SNAKE", align="center", font=("Arial", 30, "bold"))

    mensaje.goto(0, 70)
    mensaje.write("ENTER = Jugar", align="center", font=("Arial", 16, "normal"))

    mensaje.goto(0, 40)
    mensaje.write("K = Cambiar skin", align="center", font=("Arial", 16, "normal"))

    mensaje.goto(0, 10)
    mensaje.write("P = Pausa durante la partida", align="center", font=("Arial", 16, "normal"))

    mensaje.goto(0, -20)
    mensaje.write("Flechas = mover", align="center", font=("Arial", 16, "normal"))

    mensaje.goto(0, -50)
    mensaje.write("Q = salir", align="center", font=("Arial", 16, "normal"))

    mensaje.goto(0, -100)
    mensaje.write(f"Récord actual: {record}", align="center", font=("Arial", 16, "bold"))

    mensaje.goto(0, -140)
    mensaje.write(f"Skin actual: {skins[skin_actual]['nombre']}", align="center", font=("Arial", 16, "bold"))


def ocultar_mensajes():
    mensaje.clear()


def crear_obstaculos():
    global obstaculos

    for o in obstaculos:
        o.goto(1000, 1000)
        o.hideturtle()
    obstaculos.clear()

    if nivel == 1:
        return

    posiciones = []

    if nivel == 2:
        for y in range(-100, 120, 20):
            posiciones.append((-120, y))
            posiciones.append((120, y))

    elif nivel == 3:
        for x in range(-120, 140, 20):
            posiciones.append((x, 0))
        for y in range(-120, 140, 20):
            posiciones.append((0, y))

    else:
        for x in range(-180, 200, 20):
            if x not in (-20, 0, 20):
                posiciones.append((x, -160))
                posiciones.append((x, 160))
        for y in range(-120, 140, 20):
            posiciones.append((-180, y))
            posiciones.append((180, y))

    for pos in posiciones:
        o = turtle.Turtle()
        o.speed(0)
        o.shape("square")
        o.color("gray")
        o.penup()
        o.goto(pos)
        obstaculos.append(o)


def reiniciar_juego():
    global puntaje, nivel, delay, direccion, estado

    estado = "jugando"
    puntaje = 0
    nivel = 1
    delay = DELAY_INICIAL
    direccion = "Right"

    cabeza.goto(0, 0)
    cabeza.direction = "stop"

    comida.goto(0, 100)
    hoja.goto(8, 112)

    for s in segmentos:
        s.goto(1000, 1000)
    segmentos.clear()

    crear_obstaculos()
    actualizar_skin()
    actualizar_marcador()
    ocultar_mensajes()


def subir_nivel():
    global nivel, delay
    nuevo_nivel = puntaje // 5 + 1
    if nuevo_nivel != nivel:
        nivel = nuevo_nivel
        delay = max(0.05, DELAY_INICIAL - (nivel - 1) * 0.01)
        crear_obstaculos()


def mostrar_pausa():
    mensaje.clear()
    mensaje.goto(0, 0)
    mensaje.write("PAUSA\nPulsa P para continuar", align="center", font=("Arial", 22, "bold"))


def mostrar_game_over():
    mensaje.clear()
    mensaje.goto(0, 40)
    mensaje.write("GAME OVER", align="center", font=("Arial", 28, "bold"))
    mensaje.goto(0, 0)
    mensaje.write("ENTER = volver a jugar", align="center", font=("Arial", 16, "normal"))
    mensaje.goto(0, -30)
    mensaje.write("M = menú", align="center", font=("Arial", 16, "normal"))


def mover():
    x = cabeza.xcor()
    y = cabeza.ycor()

    if cabeza.direction == "Up":
        cabeza.sety(y + MOVIMIENTO)
    if cabeza.direction == "Down":
        cabeza.sety(y - MOVIMIENTO)
    if cabeza.direction == "Left":
        cabeza.setx(x - MOVIMIENTO)
    if cabeza.direction == "Right":
        cabeza.setx(x + MOVIMIENTO)


def arriba():
    if cabeza.direction != "Down" and estado == "jugando":
        cabeza.direction = "Up"


def abajo():
    if cabeza.direction != "Up" and estado == "jugando":
        cabeza.direction = "Down"


def izquierda():
    if cabeza.direction != "Right" and estado == "jugando":
        cabeza.direction = "Left"


def derecha():
    if cabeza.direction != "Left" and estado == "jugando":
        cabeza.direction = "Right"


def pausar():
    global estado
    if estado == "jugando":
        estado = "pausa"
        mostrar_pausa()
    elif estado == "pausa":
        estado = "jugando"
        ocultar_mensajes()


def cambiar_skin():
    global skin_actual
    if estado == "menu":
        skin_actual = (skin_actual + 1) % len(skins)
        actualizar_skin()
        mostrar_menu()


def ir_menu():
    global estado
    estado = "menu"
    cabeza.goto(0, 0)
    cabeza.direction = "stop"
    for s in segmentos:
        s.goto(1000, 1000)
    segmentos.clear()
    for o in obstaculos:
        o.goto(1000, 1000)
        o.hideturtle()
    obstaculos.clear()
    actualizar_marcador()
    mostrar_menu()


def iniciar():
    reiniciar_juego()


def salir():
    wn.bye()


# =========================
# TECLAS
# =========================
wn.listen()
wn.onkeypress(arriba, "Up")
wn.onkeypress(abajo, "Down")
wn.onkeypress(izquierda, "Left")
wn.onkeypress(derecha, "Right")
wn.onkeypress(pausar, "p")
wn.onkeypress(cambiar_skin, "k")
wn.onkeypress(iniciar, "Return")
wn.onkeypress(ir_menu, "m")
wn.onkeypress(salir, "q")


# =========================
# INICIO
# =========================
cargar_record()
actualizar_skin()
actualizar_marcador()
mostrar_menu()

# =========================
# LOOP
# =========================
while True:
    wn.update()

    # fondo animado
    for p in particulas:
        y = p.ycor() + 0.3
        if y > 300:
            y = -300
            p.goto(random.randint(-290, 290), y)
        else:
            p.sety(y)

    if estado == "jugando":
        # colisión con bordes
        if (
            cabeza.xcor() > 290 or cabeza.xcor() < -290 or
            cabeza.ycor() > 290 or cabeza.ycor() < -290
        ):
            estado = "gameover"
            if puntaje > record:
                record = puntaje
                guardar_record()
            actualizar_marcador()
            mostrar_game_over()

        # colisión con comida
        if cabeza.distance(comida) < 15:
            x = random.randint(-280, 280)
            y = random.randint(-280, 280)

            # alinear a cuadrícula
            x = round(x / 20) * 20
            y = round(y / 20) * 20

            comida.goto(x, y)
            hoja.goto(x + 8, y + 12)

            nuevo_segmento = turtle.Turtle()
            nuevo_segmento.speed(0)
            nuevo_segmento.shape("square")
            nuevo_segmento.color(skins[skin_actual]["cuerpo"])
            nuevo_segmento.penup()
            segmentos.append(nuevo_segmento)

            puntaje += 1
            if puntaje > record:
                record = puntaje

            subir_nivel()
            actualizar_marcador()

        # mover segmentos
        for i in range(len(segmentos) - 1, 0, -1):
            x = segmentos[i - 1].xcor()
            y = segmentos[i - 1].ycor()
            segmentos[i].goto(x, y)

        if len(segmentos) > 0:
            x = cabeza.xcor()
            y = cabeza.ycor()
            segmentos[0].goto(x, y)

        mover()

        # chocar consigo misma
        for s in segmentos:
            if s.distance(cabeza) < 10:
                estado = "gameover"
                if puntaje > record:
                    record = puntaje
                    guardar_record()
                actualizar_marcador()
                mostrar_game_over()

        # chocar con obstáculos
        for o in obstaculos:
            if o.distance(cabeza) < 10:
                estado = "gameover"
                if puntaje > record:
                    record = puntaje
                    guardar_record()
                actualizar_marcador()
                mostrar_game_over()

    time.sleep(delay if estado == "jugando" else 0.03)
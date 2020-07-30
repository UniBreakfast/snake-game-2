const ctx = canv.getContext('2d')

const apple = {
    x: 500,
    y: 300,
    width: 20,
    length: 20
}

const snake = {
    color: '#1fb9dd',
    colorHead: '#00ffff',
    colorApple: 'red',
    length: 400,
    width: 20,
    tick: 10,
    parts: [
        {
            x: 100,
            y: 100,
            length: 100,
            dir: 'down'
        },
        {
            x: 120,
            y: 180,
            length: 100,
            dir: 'right'
        },
        {
            x: 200,
            y: 130,
            length: 50,
            dir: 'up'
        },
        {
            x: 220,
            y: 130,
            length: 150,
            dir: 'right'
        }
    ]
}

function drawSnake() {
    ctx.fillStyle = snake.color
    snake.parts.forEach(part => {
        // ctx.fillStyle = rndColor()
        if (part.dir == 'up' || part.dir == 'down')  ctx.fillRect(part.x, part.y, snake.width, part.length)
        else ctx.fillRect(part.x, part.y, part.length, snake.width)
    })
    drawSnakeHead()
}

function drawApple() {
    ctx.fillStyle = snake.colorApple
    ctx.fillRect(apple.x, apple.y, apple.width, apple.width)
}

function generateApple() {
    apple.x = Math.floor(Math.random() * (canv.width - apple.width))
    apple.y = Math.floor(Math.random() * (canv.height - apple.width))
    apple.eaten = false
}

function drawSnakeHead() {
    let head = snake.parts[snake.parts.length - 1]
    ctx.fillStyle = snake.colorHead
    if (head.length > snake.width) {
        if (head.dir == 'up' || head.dir == 'left') ctx.fillRect(head.x, head.y, snake.width, snake.width)
        else if (head.dir == 'down') ctx.fillRect(head.x, head.y + head.length - snake.width, snake.width, snake.width)
        else ctx.fillRect(head.x + head.length - snake.width, head.y, snake.width, snake.width)
    } else {
        if (head.dir == 'up' || head.dir == 'down')  ctx.fillRect(head.x, head.y, snake.width, head.length)
        else ctx.fillRect(head.x, head.y, head.length, snake.width)
        const neck = snake.parts[snake.parts.length - 2]
        if (head.dir == 'up') ctx.fillRect(head.x, neck.y, snake.width, snake.width - head.length)
        else if (head.dir == 'down') ctx.fillRect(head.x, neck.y + head.length,
            snake.width, snake.width - head.length)
        else if (head.dir == 'left') ctx.fillRect(neck.x, head.y, snake.width - head.length, snake.width)
        else ctx.fillRect(neck.x + head.length, head.y, snake.width - head.length, snake.width)
        if (head.dir == 'up' || head.dir == 'left') ctx.fillRect(head.x, head.y, snake.width, snake.width)
        else if (head.dir == 'down') ctx.fillRect(head.x, head.y + head.length - snake.width, snake.width, snake.width)
        else ctx.fillRect(head.x + head.length - snake.width, head.y, snake.width, snake.width)
    }
}

function rndColor() {
    return '#' + Math.floor(Math.random() * 16777216).toString(16).padStart(6, 0)
}

function checkAppleCollision() {
    if (apple.eaten) return
    const head = snake.parts[snake.parts.length - 1]
    return doRectsOverlap(rectFrom(apple), rectFrom(head))
}

function checkSnakeCollision() {
    const head = snake.parts[snake.parts.length - 1]
    for (let i = 0; i < snake.parts.length - 1; i++) {
        if (doRectsOverlap(rectFrom(head), rectFrom(snake.parts[i]))) return true
    }
}

function checkBorderCollision() {
    const head = snake.parts[snake.parts.length - 1]
    return !(head.x >= 0 && head.y >= 0 && (head.dir == "left" || head.dir == "right" ?
        (head.x + head.length < canv.width && head.y + snake.width < canv.height) :
            (head.x + snake.width < canv.width && head.y + head.length < canv.height)))
}

function rectFrom(part) {
    const top = part.y, left = part.x,
          right = left - 1 + (part.dir == 'up' || part.dir == 'down' ? snake.width : part.length),
          bottom = top - 1 + (part.dir == 'left' || part.dir == 'right' ? snake.width : part.length)
    return {top, left, right, bottom}
}

function doRectsOverlap(rect1, rect2) {
    return !(
        rect1.left < rect2.left && rect1.right < rect2.left ||
        rect1.right > rect2.right && rect1.left > rect2.right ||
        rect1.top < rect2.top && rect1.bottom < rect2.top ||
        rect1.bottom > rect2.bottom && rect1.top > rect2.bottom
    )
}

function tick() {
    const head = snake.parts[snake.parts.length - 1]
    const tail = snake.parts[0]
    if (!apple.eaten) {
        if (tail.dir == 'down') tail.y++
        else if (tail.dir == 'right') tail.x++
        tail.length--
    }

    if (tail.length <= snake.width && !tail.portal) {
        snake.parts.shift()
        const tail = snake.parts[0]
        if (tail.dir == 'down') tail.y -= snake.width
        else if (tail.dir == 'right') tail.x -= snake.width
        tail.length += snake.width
    } else if (tail.length <= 0) {
        snake.parts.shift()
    }

    if (head.dir == 'left') head.x--
    else if (head.dir == 'up') head.y--
    head.length++
    
    ctx.clearRect(0, 0, canv.width, canv.height)
    drawApple()
    drawSnake()
    
    if (checkBorderCollision()) {
        portalSnake()
    }

    if (checkAppleCollision()) {
        apple.eaten = true
        setTimeout(generateApple, snake.tick * apple.width)
    }

    if (checkSnakeCollision()) {
        snake.color = rndColor()
        snake.colorHead = rndColor()
    }

    if (snake.nextDir && (head.length > snake.width || snake.nextDir == snake.parts[snake.parts.length - 2].dir)) {
        turnSnake(snake.nextDir)
        delete snake.nextDir
    }
}

function portalSnake() {
    const head = snake.parts[snake.parts.length - 1]
    const newHead = {length: 0}
    head.portal = true

    if (head.dir == 'up') {
        Object.assign(newHead, {
            x: head.x,
            y: canv.height - 1,
            dir: 'up'
        })
    } else if (head.dir == 'down') {
        Object.assign(newHead, {
            x: head.x,
            y: 0,
            dir: 'down'
        })
    } else if (head.dir == 'left') {
        Object.assign(newHead, {
            x: canv.width - 1,
            y: head.y,
            dir: 'left'
        })
    } else {
        Object.assign(newHead, {
            x: 0,
            y: head.y,
            dir: 'right'
        })
    }

    snake.parts.push(newHead)
}

function turnSnake(dir) {
    const head = snake.parts[snake.parts.length - 1]
    const newHead = {length: 0}

    if (dir == 'up') {
        Object.assign(newHead, {
            x: head.dir == 'left' ? head.x : head.x + head.length - snake.width,
            y: head.y,
            dir: 'up'
        })
    } else if (dir == 'down') {
        Object.assign(newHead, {
            x: head.dir == 'left' ? head.x : head.x + head.length - snake.width,
            y: head.y + snake.width,
            dir: 'down'
        })
    } else if (dir == 'left') {
        Object.assign(newHead, {
            x: head.x,
            y: head.dir == 'up' ? head.y : head.y + head.length - snake.width,
            dir: 'left'
        })
    } else {
        Object.assign(newHead, {
            x: head.x + snake.width,
            y: head.dir == 'up' ? head.y : head.y + head.length - snake.width,
            dir: 'right'
        })
    }

    snake.parts.push(newHead)
}

onkeydown = e => {
    const head = snake.parts[snake.parts.length - 1]
    if (!head.length) return

    if (e.key == 'ArrowUp' && (head.dir == 'left' || head.dir == 'right')) snake.nextDir = 'up'
    else if (e.key == 'ArrowDown' && (head.dir == 'left' || head.dir == 'right')) snake.nextDir = 'down'
    else if (e.key == 'ArrowLeft' && (head.dir == 'up' || head.dir == 'down')) snake.nextDir = 'left'
    else if (e.key == 'ArrowRight' && (head.dir == 'up' || head.dir == 'down')) snake.nextDir = 'right'
}

// drawSnake()
setInterval(tick, snake.tick)
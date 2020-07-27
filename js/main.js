const ctx = canv.getContext('2d')

const snake = {
    color: '#1fb9dd',
    colorHead: '#00ffff',
    length: 400,
    width: 20,
    tick: 30,
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
        // else if (head.dir == 'right' && neck.dir == 'up') ctx.fillRect()
        else ctx.fillRect(neck.x + head.length, head.y, snake.width - head.length, snake.width)
        if (head.dir == 'up' || head.dir == 'left') ctx.fillRect(head.x, head.y, snake.width, snake.width)
        else if (head.dir == 'down') ctx.fillRect(head.x, head.y + head.length - snake.width, snake.width, snake.width)
        else ctx.fillRect(head.x + head.length - snake.width, head.y, snake.width, snake.width)
    }
}

function rndColor() {
    return '#' + Math.floor(Math.random() * 16777216).toString(16)
}

function tick() {
    const tail = snake.parts[0]
    if (tail.dir == 'down') tail.y++
    else if (tail.dir == 'right') tail.x++
    tail.length--

    if (tail.length <= snake.width) {
        snake.parts.shift()
        const tail = snake.parts[0]
        if (tail.dir == 'down') tail.y -= snake.width
        else if (tail.dir == 'right') tail.x -= snake.width
        tail.length += snake.width
    }

    const head = snake.parts[snake.parts.length - 1]
    if (head.dir == 'left') head.x--
    else if (head.dir == 'up') head.y--
    head.length++
    
    ctx.clearRect(0, 0, canv.width, canv.height)
    drawSnake()
}

onkeydown = e => {
    const head = snake.parts[snake.parts.length - 1]
    const newHead = {length: 1}

    if (e.key == 'ArrowUp' && (head.dir == 'left' || head.dir == 'right')) {
        Object.assign(newHead, {
            x: head.dir == 'left' ? head.x : head.x + head.length - snake.width,
            y: head.y - 1,
            dir: 'up'
        })
        snake.parts.push(newHead)
    } else if (e.key == 'ArrowDown' && (head.dir == 'left' || head.dir == 'right')) {
        Object.assign(newHead, {
            x: head.dir == 'left' ? head.x : head.x + head.length - snake.width,
            y: head.y + snake.width,
            dir: 'down'
        })
        snake.parts.push(newHead)
    } else if (e.key == 'ArrowLeft' && (head.dir == 'up' || head.dir == 'down')) {
        Object.assign(newHead, {
            x: head.x - 1,
            y: head.dir == 'up' ? head.y : head.y + head.length - snake.width,
            dir: 'left'
        })
        snake.parts.push(newHead)
    } else if (e.key == 'ArrowRight' && (head.dir == 'up' || head.dir == 'down')) {
        Object.assign(newHead, {
            x: head.x + snake.width,
            y: head.dir == 'up' ? head.y : head.y + head.length - snake.width,
            dir: 'right'
        })
        snake.parts.push(newHead)
    }
}

// drawSnake()
setInterval(tick, snake.tick)
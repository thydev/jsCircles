
function Circle(cx, cy, html_id, size){
    var html_id = html_id;
    this.info = { cx: cx,  cy: cy, size: size };

    //private function that generates a random number
    var randomNumberBetween = function(min, max){
        return Math.random()*(max-min) + min;
    }

    this.initialize = function(){
        //give a random velocity for the circle
        this.info.velocity = {
            x: randomNumberBetween(-3, 3),
            y: randomNumberBetween(-3, 3)
        }

        //create a circle
        var circle = makeSVG('circle',
            { 	cx: this.info.cx,
                cy: this.info.cy,
                r:  this.info.size,
                id: html_id,
                style: "fill: black"
            });
        document.getElementById('svg').appendChild(circle);
    }

    this.update = function(time){
        var el = document.getElementById(html_id);

        //see if the circle is going outside the browser. if it is, reverse the velocity
        if ((this.info.cx + this.info.size/2)  > document.body.clientWidth 
            || (this.info.cx - this.info.size) < 0) {
            this.info.velocity.x = this.info.velocity.x * -1;
        }

        if (this.info.cy + this.info.size > document.body.clientHeight 
            || this.info.cy - this.info.size < 0){
            this.info.velocity.y = this.info.velocity.y * -1;
        }

        this.info.cx = this.info.cx + this.info.velocity.x*time;
        this.info.cy = this.info.cy + this.info.velocity.y*time;

        el.setAttribute("cx", this.info.cx);
        el.setAttribute("cy", this.info.cy);
        el.setAttribute("style", "fill: green");
    }

    //creates the SVG element and returns it
    var makeSVG = function(tag, attrs) {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
        {
            el.setAttribute(k, attrs[k]);
        }
        return el;
    }

    this.initialize();
}

function PlayGround(){
    var counter = 0;  //counts the number of circles created
    var circles = [ ]; //array that will hold all the circles created in the app

    //a loop that updates the circle's position on the screen
    this.loop = function(){
        for(circle in circles)
        {
            circles[circle].update(1);
        }
    }

    this.createNewCircle = function(x, y, size){
        var new_circle = new Circle(x, y, counter++, size);
        circles.push(new_circle);
        // console.log('created a new circle!', new_circle);
    }

    //create one circle when the game starts
    this.createNewCircle(document.body.clientWidth/2, document.body.clientHeight/2, 10);
}

if (document.readyState) {
    document.getElementById('svg').setAttribute("height", (window.innerHeight-20) + "px");
    document.getElementById('svg').setAttribute("width", window.innerWidth + "px");
 
    var playground = new PlayGround();
    setInterval(playground.loop, 15); // Call the loop very 15ms

    document.onclick = function(e) {
        var size = 10 + Math.floor(time_pressed / 500) * 10;
        playground.createNewCircle(e.x, e.y, size);
    }

    var mousedown_time, time_pressed;
    function getTime(){
        var date = new Date();
        return date.getTime();
    }
    document.onmousedown = function(e){
        mousedown_time = getTime();
    }
    document.onmouseup = function(e){
        time_pressed = getTime() - mousedown_time;
    }
}


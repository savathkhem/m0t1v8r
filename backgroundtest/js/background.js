var SEPARATION = 40,
    AMOUNTX = 35,
    AMOUNTY = 35;
var container, stats;
var camera, scene, renderer;
var particles, particle, count = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 250;
    camera.position.y = 100;
    scene = new THREE.Scene();
    particles = new Array();
    // particles
    var PI2 = Math.PI * 2;
    var material = new THREE.SpriteCanvasMaterial({
        color: 0xf8f9fa,
        program: function(context) {
            context.beginPath();
            context.arc(0, 0, 0.2, PI2, 0.5, true);
            context.shadowBlur = 25;
            context.shadowColor = "#f8f9fa";
            context.fill();
        }
    });
    var geometry = new THREE.Geometry();
    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: 0xf8f9fa,
        opacity: 0.3
    }));
    scene.add(line);
    var i = 0;
    for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[i++] = new THREE.Sprite(material);
            particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
            particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
            scene.add(particle);
            geometry.vertices.push(particle.position);
        }
    }
    renderer = new THREE.CanvasRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    var i = 0;
    for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[i++];
            particle.position.y = (Math.sin((ix + count) * 0.7) * 20) + (Math.sin((iy + count) * 0.2) * 60);
            particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 4 + (Math.sin((iy + count) * 0.5) + 1) * 4;
        }
    }
    camera.rotation.x = 75;
    renderer.render(scene, camera);
    count += 0.05;
}
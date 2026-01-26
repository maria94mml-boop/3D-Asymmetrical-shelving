let scene, camera, renderer, controls;

const width = 80;
const baseDepth = 30;
const topDepth = 20;
const height = 30;
const thickness = 2;


init();
animate();

/**
 * Función de inicialización de la escena   
 */

function init(){

    /**Creación de la escena */
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf2f2f2);

    /**Configuración de la cámara alineada con el eje Y, mirando al origen */
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, -120, 60);
    camera.lookAt(0, 0, 10);

    /**Configuración del renderer */
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("canvas"),
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;

    /**Configuración de luces AmbientLight y DirectionalLight */
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dir = new THREE.DirectionalLight(0xffffff, 1.5);
    dir.position.set(5, 10, 5);
    dir.castShadow = true;
    scene.add(dir);

    /**Utilización de helpers (grid y axes) */
    const grid = new THREE.GridHelper(200, 10);
    scene.add(grid);
    const axes = new THREE.AxesHelper(100);
    scene.add(axes);

    /**Creación base y parte superior */
    const baseGeometry = new THREE.BoxGeometry(width, baseDepth, thickness);
    const baseMaterial = new THREE.MeshStandardMaterial({color: 0x808080});
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, 0, 0);
    scene.add(base);

    const topGeometry = new THREE.BoxGeometry(width, topDepth, thickness);
    const topMaterial = new THREE.MeshStandardMaterial({color: 0x404040});
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.set(0, 0, height);
    scene.add(top);

    /**Cálculo de las coordenadas de las esquinas */
    const halfWidth = width / 2;
    console.log("halfWidth:", halfWidth);
    const halfBaseDepth = baseDepth / 2;
    console.log("halfBaseDepth:", halfBaseDepth);
    const halfTopDepth = topDepth / 2;
    console.log("halfTopDepth:", halfTopDepth);

    /**Comprobación de puntos */
    const p = new THREE.Vector3(40,15,0);
    const p1= new THREE.Vector3(-40,15,0);
    const p2= new THREE.Vector3(40,-15,0);
    const p3= new THREE.Vector3(-40,-15,0);

    drawPoint(p, 0x0000ff);
    drawPoint(p1, 0xff0000);
    drawPoint(p2, 0x00ff00);
    drawPoint(p3, 0xffff00);

    const p4 = new THREE.Vector3(40,10,30);
    const p5= new THREE.Vector3(-40,10,30);
    const p6= new THREE.Vector3(40,-10,30);
    const p7= new THREE.Vector3(-40,-10,30);

    drawPoint(p4, 0x0000ff);
    drawPoint(p5, 0xff0000);
    drawPoint(p6, 0x00ff00);
    drawPoint(p7, 0xffff00);

    /* Esquinas de la base y la parte superior */
    const baseCorners = [
    new THREE.Vector3( halfWidth,  halfBaseDepth, 0),
    new THREE.Vector3(-halfWidth,  halfBaseDepth, 0),
    new THREE.Vector3( halfWidth, -halfBaseDepth, 0),
    new THREE.Vector3(-halfWidth, -halfBaseDepth, 0),
    ];
    console.log("baseCorners:", baseCorners);

    const topCorners = [
    new THREE.Vector3( halfWidth,  halfTopDepth, height),
    new THREE.Vector3(-halfWidth,  halfTopDepth, height),
    new THREE.Vector3( halfWidth, -halfTopDepth, height),
    new THREE.Vector3(-halfWidth, -halfTopDepth, height),
    ];
    console.log("topCorners:", topCorners);
    
    /**Evento de redimensionamiento de la ventana */
    window.addEventListener('resize', onResize);
}

/** Función para dibujar puntos */
function drawPoint(position, color = 0xff0000, size = 2) {
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(position);
    scene.add(sphere);
    return sphere;
}

/** Función de animación */
function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera); 
}

/** Función para manejar el redimensionamiento de la ventana */
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
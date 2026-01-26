let scene, camera, renderer, controls;
let shelfGroup = null;  

const width = 80;
const baseDepth = 30;
const topDepth = 20;
const height = 30;
const thickness = 1;

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
    camera.position.set(0, -220, 60);
    camera.lookAt(0, 0, height / 2);

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
    //const grid = new THREE.GridHelper(200, 10);
    //scene.add(grid);
    const axes = new THREE.AxesHelper(100);
    scene.add(axes);

    /**Configuración de los controles de órbita */
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 50;
    controls.maxDistance = 300;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.update();

    /**Configuración del input para la altura del estante */
    const heightInput = document.getElementById("heightInput");

    heightInput.addEventListener("input", () => {
        const newHeight = Number(heightInput.value);
        buildAsymmetricShelf(newHeight);
    });

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

/** Función para calcular las esquinas de la base y la parte superior */
function computeCorners(width, depth, z, offsetY=0) {

    const halfWidth = width / 2;
    const halfDepth= depth / 2;
    const halfthickness = thickness / 2;   

    return [
        new THREE.Vector3( halfWidth - halfthickness, offsetY + halfDepth - halfthickness, z),
        new THREE.Vector3(-halfWidth + halfthickness, offsetY + halfDepth - halfthickness, z),
        new THREE.Vector3( halfWidth - halfthickness, offsetY - halfDepth + halfthickness, z),
        new THREE.Vector3(-halfWidth + halfthickness, offsetY - halfDepth + halfthickness, z),
    ];
}

/** Función para crear los laterales */
function createLateral(from, to, material) {
    const length = from.distanceTo(to);

    const geometry = new THREE.BoxGeometry(thickness, thickness, length);
    const mesh = new THREE.Mesh(geometry, material);

    /**Colocar en el punto medio */
    const midPoint = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    console.log("midPoint:", midPoint);
    mesh.position.copy(midPoint);

    /**Alinear con la dirección */
    mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1), /**Vector inicial (eje Z)*/
        new THREE.Vector3().subVectors(to, from).normalize() /**Vector dirección*/
    );

    return mesh;
}

/** Función para crear la geometría del estante */
function createShelfGeometry(shelfGroup, height) {


    /**Creación base y parte superior */
    const baseGeometry = new THREE.BoxGeometry(width, baseDepth, thickness);
    const baseMaterial = new THREE.MeshStandardMaterial({color: 0x808080});
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, 0, 0);
    shelfGroup.add(base);

    const topGeometry = new THREE.BoxGeometry(width, topDepth, thickness);
    const topMaterial = new THREE.MeshStandardMaterial({color: 0x404040});
    const top = new THREE.Mesh(topGeometry, topMaterial);
    const offsetY= (baseDepth - topDepth)/2;
    top.position.set(0, offsetY, height);
    shelfGroup.add(top);

    /**Cálculo de las esquinas */
    const baseCorners = computeCorners(width, baseDepth, 0);
    const topCorners = computeCorners(width,topDepth, height,offsetY);

    const lateralMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });

    /**Creación de los laterales */
    for (let i = 0; i < 4; i++) {
    const lateral = createLateral(
        baseCorners[i],
        topCorners[i],
        lateralMaterial
    );
    console.log("lateral", i, ":", lateral);
    shelfGroup.add(lateral);
    }
}

/** Función para construir el estante asimétrico */
function buildAsymmetricShelf(height) {
    if (shelfGroup) {
        scene.remove(shelfGroup);
    }

    shelfGroup = new THREE.Group();
    scene.add(shelfGroup);

    createShelfGeometry(shelfGroup, height);
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

buildAsymmetricShelf(30);
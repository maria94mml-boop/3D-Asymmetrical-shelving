let scene, camera, renderer, controls;

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
    camera.position.set(10,-500,120);
    camera.lookAt(0,0,120);

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

    /**Evento de redimensionamiento de la ventana */
    window.addEventListener('resize', onResize);
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
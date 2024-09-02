document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 3D Contour Plot Animation
function createContourPlot() {
    const container = document.getElementById('logo-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Set background to transparent
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2, 100, 100);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            varying vec2 vUv;
            uniform float time;
            void main() {
                vUv = uv;
                vec3 pos = position;
                pos.z = sin(pos.x * 10.0 + time) * 0.1 + cos(pos.y * 10.0 + time) * 0.1;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform float time;
            
            vec3 rainbow(float t) {
                vec3 c = 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
                return c;
            }
            
            void main() {
                float t = sin(vUv.x * 10.0 + time) * 0.1 + cos(vUv.y * 10.0 + time) * 0.1;
                gl_FragColor = vec4(rainbow(t), 1.0);
            }
        `,
        side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(geometry, material);

    scene.add(plane);
    camera.position.z = 1.5;

    function animate(time) {
        time *= 0.001;  // Convert time to seconds
        requestAnimationFrame(animate);
        material.uniforms.time.value = time;
        plane.rotation.x = time * 0.5;
        plane.rotation.y = time * 0.2;
        renderer.render(scene, camera);
    }

    animate();
}

// Initialize the contour plot when the page loads
window.addEventListener('load', createContourPlot);
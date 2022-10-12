import * as Three from 'three';
import { Viewport } from '../engine/viewport';

/**
 * A body somewhat resembling a planet.
 */
export class Planet {
    baseColor: Three.Color;
    hasRings: boolean;
    bodyRadius: number;
    orbitRadius: number;
    orbitOffset: number;

    public constructor(
        color: number,
        rings: boolean,
        radius: number,
        orbit: number, offset: number)
    {
        this.baseColor = new Three.Color(color);
        this.hasRings = rings;
        this.bodyRadius = radius;
        this.orbitRadius = orbit;
        this.orbitOffset = offset;
    }

    public addToViewport = (viewport: Viewport) => {
        const pos = this.calcPositionVector();

        const body = this.makeBody();
        body.position.set(pos.x, pos.y, pos.z);
        viewport.scene.add(body);

        if (this.hasRings) {
            const rings = this.makeRings();
            rings.position.set(pos.x, pos.y, pos.z);
            viewport.scene.add(rings);
        }
    }

    private makeBody = () : Three.Mesh => {
        const geometry = new Three.SphereGeometry(this.bodyRadius, 64, 64);
        const material = new Three.MeshPhongMaterial({
            emissive: this.baseColor,
            emissiveIntensity: 0.6
        });
        const mesh = new Three.Mesh(geometry, material);

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }

    private makeRings = () : Three.Mesh => {
        const innerRadius = this.bodyRadius * 1.1;
        const outerRadius = this.bodyRadius * 1.5;
        const emissiveColor = this.baseColor;

        const geometry = new Three.RingGeometry(innerRadius, outerRadius, 30, 1);
        const material = new Three.MeshPhongMaterial({
            emissive: emissiveColor,
            emissiveIntensity: 0.3
        });
        const mesh = new Three.Mesh(geometry, material);

        mesh.rotateX(1);

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;

    }

    private calcPositionVector = () : Three.Vector3 => {
        return new Three.Vector3(this.orbitRadius, 0.0, 0.0);
    }
}

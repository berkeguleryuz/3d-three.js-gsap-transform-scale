"use client";
import React, { useEffect, useRef, useCallback } from "react";
import SwatchWrapper from "./SwatchWrapper";
import { DataType } from "../types";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import gsap from "gsap";

interface CanvasProps {
  activeData: DataType;
  swatchData: DataType[];
  onSwatchSelect: (selectedItem: DataType) => void;
  handleLoading?: () => void;
}

interface MeshProperties {
  color: string;
}

const Canvas = ({
  activeData,
  swatchData,
  onSwatchSelect,
  handleLoading,
}: CanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const managerRef = useRef<THREE.LoadingManager | null>(null);
  const sizesRef = useRef({ width: 0, height: 0 });

  const handleItemSelection = useCallback(
    (itemId: number) => {
      const selectedItem = swatchData.find((item) => item.id === itemId);
      if (selectedItem) {
        onSwatchSelect(selectedItem);
      }
    },
    [swatchData, onSwatchSelect],
  );

  const applyMaterial = useCallback(() => {
    if (!sceneRef.current) {
      return;
    }
    if (!activeData.itemList) {
      return;
    }


    sceneRef.current.traverse((element) => {
      if (element instanceof THREE.Mesh) {
        Object.entries(activeData.itemList!).forEach(
          ([meshName, meshProps]: [string, MeshProperties]) => {
            if (meshName === element.name) {
              const colorValue = new THREE.Color(
                meshProps.color,
              ).convertSRGBToLinear();
              if (
                element.material instanceof THREE.MeshStandardMaterial ||
                element.material instanceof THREE.MeshPhysicalMaterial
              ) {
                gsap.to(element.material.color, {
                  r: colorValue.r,
                  g: colorValue.g,
                  b: colorValue.b,
                  ease: "power3.inOut",
                  duration: 0.8,
                });
              }
              (element.material as THREE.Material).needsUpdate = true;
            }
          },
        );
      }
    });

    if (activeData.buttonColor?.background && highlightRef.current) {
      gsap.to(highlightRef.current, {
        backgroundColor: activeData.buttonColor.background,
        ease: "power3.inOut",
        duration: 0.8,
      });
    }
  }, [activeData]);

  const resize = useCallback(() => {
    if (
      containerRef.current &&
      rendererRef.current &&
      cameraRef.current &&
      sizesRef.current
    ) {
      sizesRef.current.width = containerRef.current.offsetWidth;
      sizesRef.current.height = containerRef.current.offsetHeight;

      if (rendererRef.current) {
        rendererRef.current.setSize(
          sizesRef.current.width,
          sizesRef.current.height,
        );
      }
      if (cameraRef.current) {
        cameraRef.current.aspect =
          sizesRef.current.width / sizesRef.current.height;
        cameraRef.current.updateProjectionMatrix();
      }
    }
  }, []);

  const loadHDR = useCallback(() => {
    if (!managerRef.current || !sceneRef.current) return;
    new RGBELoader(managerRef.current)
      .setDataType(THREE.HalfFloatType)
      .load("/default.hdr", (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.needsUpdate = true;
        if (sceneRef.current) {
          sceneRef.current.environment = texture;
        }
        texture.dispose();
      });
  }, []);

  const addModel = useCallback(() => {
    if (!managerRef.current || !sceneRef.current) return;
    const THREE_PATH = `https://unpkg.com/three@0.${THREE.REVISION}.x`;
    const DRACO_LOADER = new DRACOLoader(managerRef.current).setDecoderPath(
      `${THREE_PATH}/examples/jsm/libs/draco/gltf/`,
    );

    const modelPath = "/bag.glb";
    const gltfLoader = new GLTFLoader(managerRef.current).setDRACOLoader(
      DRACO_LOADER,
    );
    gltfLoader.load(modelPath, (gltf) => {
      gltf.scene.position.set(0, -30, 0);
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material instanceof THREE.Material) {
            child.material.needsUpdate = true;
          }
        }
      });
      if (sceneRef.current) {
        sceneRef.current.add(gltf.scene);
      }
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvasElement = canvasRef.current;

    if (!container || !canvasElement || typeof window === "undefined") return;

    const itemRect = container.getBoundingClientRect();
    sizesRef.current = {
      width: itemRect.width,
      height: itemRect.height,
    };

    if (!sizesRef.current.width || !sizesRef.current.height) return;

    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      45,
      sizesRef.current.width / sizesRef.current.height,
      10,
      5000,
    );
    cameraRef.current.position.set(150, 20, 100);
    sceneRef.current.add(cameraRef.current);

    managerRef.current = new THREE.LoadingManager();
    if (handleLoading) {
      managerRef.current.onProgress = (url, itemsLoaded, itemsTotal) => {
        const ProgressVal = (itemsLoaded / itemsTotal) * 100;
        if (ProgressVal === 100) {
          handleLoading();
        }
      };
    }

    if (cameraRef.current && canvasElement) {
      controlsRef.current = new OrbitControls(cameraRef.current, canvasElement);
      controlsRef.current.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      };
      controlsRef.current.enableDamping = true;
      controlsRef.current.autoRotate = true;
      controlsRef.current.autoRotateSpeed = 2;
      controlsRef.current.enablePan = false;
      controlsRef.current.enableZoom = false;
      controlsRef.current.maxPolarAngle = Math.PI / 1.9;
    }

    rendererRef.current = new THREE.WebGLRenderer({
      canvas: canvasElement,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    rendererRef.current.setSize(
      sizesRef.current.width,
      sizesRef.current.height,
    );
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (rendererRef.current) {
      rendererRef.current.outputColorSpace = THREE.SRGBColorSpace;
      rendererRef.current.toneMapping = THREE.ACESFilmicToneMapping;
      rendererRef.current.toneMappingExposure = 1;
      rendererRef.current.shadowMap.enabled = true;
    }

    loadHDR();
    addModel();
    window.addEventListener("resize", resize);

    let animationFrameId: number;
    const renderLoop = () => {
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      animationFrameId = window.requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrameId);
      if (rendererRef.current) rendererRef.current.dispose();
      if (controlsRef.current) controlsRef.current.dispose();
    };
  }, [handleLoading, loadHDR, addModel, resize]);

  useEffect(() => {
    if (activeData && sceneRef.current) {
      applyMaterial();
    }
  }, [activeData, applyMaterial]);

  return (
    <div
      ref={containerRef}
      id="container"
      className="w-full h-3/5 relative flex justify-center items-end p-4 lg:w-1/2 lg:h-full lg:items-center">
      <canvas
        ref={canvasRef}
        className="webgl w-full h-full relative z-10"></canvas>
      <SwatchWrapper
        items={swatchData}
        activeItemId={activeData.id}
        onItemClick={handleItemSelection}
      />
      <div
        ref={highlightRef}
        className="highlight w-2/5 h-1/2 bg-[#D7B172] absolute inset-x-40 top-0 rounded-br-full rounded-bl-full md:inset-x-60  lg:inset-x-40"></div>
    </div>
  );
};

export default Canvas;

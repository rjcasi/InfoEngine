// frontend/src/api.ts
import React from "react";

// Ping backend
export async function pingBackend() {
  const res = await fetch("http://localhost:5000/");
  return res.json();
}

// Eigen organ
export async function computeEigen(matrix: number[][]) {
  const res = await fetch("http://localhost:5000/eigen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matrix }),
  });

  if (!res.ok) {
    throw new Error(`Eigen error: ${res.status}`);
  }

  return res.json();
}

// NAND organ
export async function computeNand(a: number, b: number) {
  const res = await fetch("http://localhost:5000/nand", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ a, b }),
  });

  if (!res.ok) {
    throw new Error(`NAND error: ${res.status}`);
  }

  return res.json();
}

// Spike Neuron organ
export async function simulateSpike(inputs: number[]) {
  const res = await fetch("http://localhost:5000/spike", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inputs }),
  });

  if (!res.ok) {
    throw new Error(`Spike neuron error: ${res.status}`);
  }

  return res.json();
}

// Power Spectrum organ
export async function computePowerSpectrum(
  potentials: number[],
  dt: number = 1.0
) {
  const res = await fetch("http://localhost:5000/power-spectrum", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ potentials, dt }),
  });

  if (!res.ok) {
    throw new Error(`Power spectrum error: ${res.status}`);
  }

  return res.json();
}
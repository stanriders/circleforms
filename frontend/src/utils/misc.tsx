import React from "react";

export function isEmpty(obj: Record<any, unknown>) {
  if (!obj) return true;
  return Object.keys(obj)?.length === 0;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function withEvent(func: Function): React.ChangeEventHandler<any> {
  return (event: React.ChangeEvent<any>) => {
    const { target } = event;
    func(target.value);
  };
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function arraysEqual<T>(a1: Array<T>, a2: Array<T>) {
  /* WARNING: arrays must not contain {objects} or behavior may be undefined */
  return JSON.stringify(a1) == JSON.stringify(a2);
}

export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

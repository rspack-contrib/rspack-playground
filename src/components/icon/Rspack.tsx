import type { JSX } from "react";

export default function Rspack(props: JSX.IntrinsicElements["img"]) {
  return (
    <img
      src="https://assets.rspack.rs/rspack/rspack-logo.svg"
      alt="Rspack"
      {...props}
    />
  );
}

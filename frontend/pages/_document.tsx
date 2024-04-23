import Navigation from "./navigation/navbar";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <Navigation toggle={function (): void {
          throw new Error("Function not implemented.");
        } }/>
      <body>
        
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

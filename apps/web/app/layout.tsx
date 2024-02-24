"use client";

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AsyncLayoutDynamic from "@/containers/async-layout-dynamic";
import "reflect-metadata";
import { plexMono, museoSlab } from "./fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>ZkNoid gaming platform</title>
        <meta property="og:title" content="ZkNoid gaming platform" key="title" />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href={"/favicon.ico"}
        />
      </head>
      <body className={`${museoSlab.variable} ${plexMono.variable}`}>
        <AsyncLayoutDynamic>{children}</AsyncLayoutDynamic>
      </body>
    </html>
  )
}

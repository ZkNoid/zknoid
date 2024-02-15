"use client";

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AsyncLayoutDynamic from "@/containers/async-layout-dynamic";
import Head from 'next/head';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <title>ZkNoid games store</title>
        <meta property="og:title" content="ZkNoid games store" key="title" />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href={"/favicon.ico"}
        />
      </Head>
      <body className='font-mono'>
        <AsyncLayoutDynamic>{children}</AsyncLayoutDynamic>
      </body>
    </html>
  )
}

'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { Physics2DPlugin } from 'gsap/Physics2DPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

// Registro único de plugins: hacerlo por componente produce avisos y fallos con Fast Refresh.
gsap.registerPlugin(ScrollTrigger, SplitText, Physics2DPlugin, DrawSVGPlugin, MotionPathPlugin, useGSAP)

export { gsap, ScrollTrigger, SplitText, useGSAP }

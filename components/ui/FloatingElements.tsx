'use client'

import { motion } from 'framer-motion'

interface FloatingElementProps {
  className?: string
  variant?: 'circle' | 'ring' | 'dot' | 'square' | 'gradient'
  size?: number
  color?: string
  duration?: number
  delay?: number
  amplitude?: number
}

export function FloatingElement({
  className = '',
  variant = 'circle',
  size = 100,
  color = 'rgba(3, 193, 202, 0.2)',
  duration = 6,
  delay = 0,
  amplitude = 20
}: FloatingElementProps) {
  const floatAnimation = {
    y: [-amplitude, amplitude, -amplitude],
    x: [-amplitude / 2, amplitude / 2, -amplitude / 2],
    rotate: [0, 5, -5, 0]
  }

  const renderShape = () => {
    switch (variant) {
      case 'circle':
        return (
          <div
            className="rounded-full"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              filter: 'blur(20px)'
            }}
          />
        )
      case 'ring':
        return (
          <div
            className="rounded-full"
            style={{
              width: size,
              height: size,
              border: `2px solid ${color}`,
              background: 'transparent'
            }}
          />
        )
      case 'dot':
        return (
          <div
            className="rounded-full"
            style={{
              width: size,
              height: size,
              background: color
            }}
          />
        )
      case 'square':
        return (
          <div
            style={{
              width: size,
              height: size,
              background: color,
              transform: 'rotate(45deg)'
            }}
          />
        )
      case 'gradient':
        return (
          <div
            className="rounded-full"
            style={{
              width: size,
              height: size,
              background: `conic-gradient(from 0deg, ${color}, transparent, ${color})`,
              filter: 'blur(30px)'
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      animate={floatAnimation}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut'
      }}
    >
      {renderShape()}
    </motion.div>
  )
}

// Preset floating elements for different sections
export function FloatingCircles({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <FloatingElement
        variant="circle"
        size={200}
        color="rgba(3, 193, 202, 0.15)"
        className="top-[10%] right-[5%]"
        duration={8}
        amplitude={30}
      />
      <FloatingElement
        variant="circle"
        size={150}
        color="rgba(3, 193, 202, 0.1)"
        className="bottom-[20%] left-[10%]"
        duration={7}
        delay={1}
        amplitude={25}
      />
      <FloatingElement
        variant="ring"
        size={80}
        color="rgba(3, 193, 202, 0.3)"
        className="top-[30%] left-[20%]"
        duration={5}
        delay={0.5}
        amplitude={15}
      />
      <FloatingElement
        variant="dot"
        size={12}
        color="rgba(3, 193, 202, 0.4)"
        className="top-[50%] right-[15%]"
        duration={4}
        delay={2}
        amplitude={10}
      />
      <FloatingElement
        variant="dot"
        size={8}
        color="rgba(3, 193, 202, 0.5)"
        className="bottom-[30%] right-[25%]"
        duration={3.5}
        delay={1.5}
        amplitude={8}
      />
    </div>
  )
}

export function FloatingDots({ className = '' }: { className?: string }) {
  const positions = [
    { top: '10%', left: '5%' },
    { top: '20%', left: '17%' },
    { top: '30%', left: '29%' },
    { top: '40%', left: '41%' },
    { top: '50%', left: '53%' },
    { top: '60%', left: '65%' },
    { top: '70%', left: '77%' },
    { top: '0%', left: '89%' },
  ]
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: pos.top,
            left: pos.left,
            width: 4 + (i % 3) * 4,
            height: 4 + (i % 3) * 4,
            background: `rgba(3, 193, 202, ${0.2 + (i % 4) * 0.1})`
          }}
          animate={{
            y: [-(5 + (i % 3) * 5), 5 + (i % 3) * 5],
            x: [-(2.5 + (i % 3) * 2.5), 2.5 + (i % 3) * 2.5]
          }}
          transition={{
            duration: 3 + (i % 3),
            delay: i * 0.3,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

// Animated gradient orb
export function GradientOrb({
  className = '',
  size = 300,
  colors = ['rgba(3, 193, 202, 0.3)', 'rgba(3, 193, 202, 0.1)']
}: {
  className?: string
  size?: number
  colors?: string[]
}) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${colors[0]} 0%, ${colors[1]} 50%, transparent 70%)`,
        filter: 'blur(40px)'
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 0.8, 0.5]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut'
      }}
    />
  )
}

// Moving lines/streaks
export function MovingLine({
  className = '',
  direction = 'horizontal'
}: {
  className?: string
  direction?: 'horizontal' | 'vertical'
}) {
  const isHorizontal = direction === 'horizontal'

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: isHorizontal ? 100 : 2,
        height: isHorizontal ? 2 : 100,
        background: 'linear-gradient(90deg, transparent, rgba(3, 193, 202, 0.5), transparent)'
      }}
      animate={{
        x: isHorizontal ? ['-100%', '200%'] : 0,
        y: isHorizontal ? 0 : ['-100%', '200%'],
        opacity: [0, 1, 0]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  )
}

// Pulsing element
export function PulsingElement({
  className = '',
  size = 20,
  color = 'rgba(3, 193, 202, 0.5)'
}: {
  className?: string
  size?: number
  color?: string
}) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: color
      }}
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.7, 0.3, 0.7]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  )
}

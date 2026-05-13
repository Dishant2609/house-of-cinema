# House of Cinema — Design System

## Vision
Luxury digital cinema lounge. Like stepping into a premium IMAX theater that exists online. Every pixel should feel intentional, emotional, and cinematic.

## Color Palette
- **Background**: `#050508` (near-black, deep space)
- **Surface**: `#0d0d14` (dark charcoal)
- **Surface Elevated**: `#12121e` (card backgrounds)
- **Border**: `#1e1e30` (subtle border)
- **Crimson**: `#c0392b` → `#e74c3c` (accent, CTAs)
- **Gold**: `#d4a017` → `#f0c040` (luxury highlights, ratings)
- **Gold Glow**: `rgba(212, 160, 23, 0.15)` (glow effects)
- **Crimson Glow**: `rgba(192, 57, 43, 0.2)` (hover glows)
- **Text Primary**: `#f5f0e8` (warm white)
- **Text Secondary**: `#9a9098` (muted)
- **Text Muted**: `#4a4558` (very muted)

## Typography
- **Display**: `Cinzel` (Google Font) — hero titles, section headings. Luxury serif feel.
- **Body**: `Inter` — UI text, descriptions, labels. Clean, readable.
- **Accent**: `Playfair Display` — emotional quotes, taglines

## Spacing
- Generous: 80–120px section padding
- Cards: 16px gap, 12px internal padding
- Micro: 4/8/12/16/24px scale

## Effects
- Glassmorphism: `backdrop-filter: blur(12px)` + `bg-white/5` borders
- Gold glow on hover: `box-shadow: 0 0 30px rgba(212,160,23,0.3)`
- Crimson glow on CTA: `box-shadow: 0 0 40px rgba(192,57,43,0.4)`
- Gradient overlays on images: linear from transparent to near-black
- Noise texture on hero backgrounds

## Motion
- Page transitions: fade + slight upward drift (0.4s ease)
- Card hover: scale(1.03) + glow border
- Quiz cards: slide in from right, exit left
- Staggered grid reveals on scroll

## Anti-Patterns to Avoid
- No bright white backgrounds
- No purple gradients
- No generic rounded card grids
- No Inter as display font
- No flat unstyled buttons

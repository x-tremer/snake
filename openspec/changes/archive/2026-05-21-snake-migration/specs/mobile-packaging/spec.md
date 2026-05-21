# mobile-packaging Specification

## Purpose
Capacitor wrappers for iOS and Android, touch/swipe input, responsive canvas, splash and status bar config.

## Requirements

### Requirement: Capacitor Platform Configs
The project SHALL include Capacitor config for iOS and Android platforms. Build scripts SHALL produce runnable `.apk` (Android) and `.app` (iOS).

### Requirement: Touch/Swipe Input
Touch gestures SHALL control snake direction. Swipe up/down/left/right SHALL map to directions. An on-screen directional pad SHALL be available as fallback.

#### Scenario: Swipe changes direction
- **GIVEN** game state is `playing` on a touch device
- **WHEN** user swipes right
- **THEN** snake direction changes to right if not currently moving left

### Requirement: Responsive Canvas Sizing
The canvas SHALL resize to fit the viewport while maintaining aspect ratio. Touch targets SHALL remain usable at all sizes.

### Requirement: Splash Screen and Status Bar
Splash screen SHALL display on app launch. Status bar SHALL be configured per platform. Config SHALL be in standard Capacitor files.

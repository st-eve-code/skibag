# Responsive Fix Plan for app/(tabs)/index.tsx

## Issues to Fix:

1. **Banner**: Fixed height (200px) - needs to scale with screen
2. **Game Card Image**: Fixed height (180px) - needs responsive scaling
3. **Small Game Cards**: Fixed width (160px) and height (220px) - needs to adapt to screen width
4. **Grid Game Cards**: Fixed height (180px) - needs to scale with aspect ratio
5. **Font Sizes**: Fixed values - need to scale with screen width
6. **Padding/Margins**: Fixed values - need to scale with screen width
7. **Header**: Fixed padding - needs to scale
8. **Categories**: Fixed padding - needs to scale

## Solution Approach:

- Use `Dimensions.get('window').width` for responsive calculations
- Use percentage-based dimensions where appropriate
- Scale font sizes using a responsive helper function
- Use `flex: 1` with aspectRatio for image containers
- Make horizontal scroll items responsive based on screen width

## Implementation Steps:

1. Add responsive helper utilities (dimensions, scaling functions)
2. Update banner container with responsive height
3. Update game card with responsive image height
4. Update horizontal scroll game cards with responsive dimensions
5. Update grid game cards with responsive heights
6. Scale all font sizes appropriately
7. Update padding/margins with responsive values
8. Ensure all images have proper width constraints

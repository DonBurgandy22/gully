package com.example.mindmapapp.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material.MaterialTheme
import androidx.compose.material.darkColors
import androidx.compose.material.lightColors
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Define color palettes for light and dark themes. These values mirror the ones
// declared in res/values/colors.xml but are specified here to be used by
// Compose's MaterialTheme. Feel free to adjust these to customize the look and
// feel of the app.
private val DarkColorPalette = darkColors(
    primary = Color(0xFF6200EE),
    primaryVariant = Color(0xFF3700B3),
    secondary = Color(0xFF03DAC6)
)

private val LightColorPalette = lightColors(
    primary = Color(0xFF6200EE),
    primaryVariant = Color(0xFF3700B3),
    secondary = Color(0xFF03DAC6),
    background = Color.White,
    surface = Color.White,
    onPrimary = Color.White,
    onSecondary = Color.Black,
    onBackground = Color.Black,
    onSurface = Color.Black
)

/**
 * Top level theme wrapper for the app. Applies either a light or dark color
 * palette depending on the system preference. It also uses custom shapes and
 * typography defined in this package.
 *
 * @param darkTheme whether to use the dark color palette; defaults to system
 *   setting
 * @param content the composable content to which the theme should be applied
 */
@Composable
fun MindMapAppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colors = if (darkTheme) {
        DarkColorPalette
    } else {
        LightColorPalette
    }

    MaterialTheme(
        colors = colors,
        typography = Typography,
        shapes = Shapes,
        content = content
    )
}
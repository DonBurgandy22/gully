package com.example.mindmapapp.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Shapes
import androidx.compose.ui.unit.dp

// Defines shape appearances for Material components. Rounded corners help
// convey a card-like appearance for each node in the mind map. You can
// customize these values to alter the visual language of your app.
val Shapes = Shapes(
    small = RoundedCornerShape(4.dp),
    medium = RoundedCornerShape(4.dp),
    large = RoundedCornerShape(0.dp)
)
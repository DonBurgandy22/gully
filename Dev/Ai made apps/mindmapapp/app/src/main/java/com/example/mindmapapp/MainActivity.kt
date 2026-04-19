package com.example.mindmapapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material.Card
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Surface
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.mindmapapp.ui.theme.MindMapAppTheme

/**
 * Entry point for the mind map application.
 *
 * This activity hosts a simple clickable mind map representation of a correlation
 * analysis between different types of information and market reactions. Each node
 * in the map can be expanded or collapsed by tapping on it. Nodes are nested
 * according to the hierarchy of the analysis, and indentations visually indicate
 * parent/child relationships.
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MindMapAppTheme {
                // A surface container using the 'background' color from the theme
                Surface(color = MaterialTheme.colors.background) {
                    val root = sampleMindMap()
                    MindMap(node = root)
                }
            }
        }
    }
}

/**
 * Data model representing a node in the mind map. Each node may have a title,
 * optional descriptive content, and a list of children. Leaf nodes contain only
 * a title and content, whereas internal nodes contain children.
 */
data class Node(
    val title: String,
    val content: String? = null,
    val children: List<Node> = emptyList()
)

/**
 * Composable that renders a single node in the mind map. Nodes are indented
 * according to their depth level. Tapping on a node toggles its expansion
 * state; expanding reveals child nodes and optional content. Leaf nodes
 * immediately display their content.
 *
 * @param node the data representing this mind map node
 * @param level the depth level of the node; used for indentation
 */
@Composable
fun MindMap(node: Node, level: Int = 0) {
    var expanded by remember { mutableStateOf(false) }
    Card(
        elevation = 4.dp,
        modifier = Modifier
            .padding(start = (level * 16).dp, top = 4.dp, bottom = 4.dp, end = 4.dp)
            .clickable { if (node.children.isNotEmpty()) expanded = !expanded }
    ) {
        Column(modifier = Modifier.padding(8.dp)) {
            Text(text = node.title, style = MaterialTheme.typography.h6)
            node.content?.let {
                // Show leaf content or expanded internal node content
                if (expanded || node.children.isEmpty()) {
                    Text(
                        text = it,
                        style = MaterialTheme.typography.body2,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }
            }
            if (expanded) {
                node.children.forEach {
                    MindMap(node = it, level = level + 1)
                }
            }
        }
    }
}

/**
 * Constructs a sample mind map based on the correlation analysis provided. The
 * hierarchy mirrors the relationships between different information types and
 * their impacts on financial markets. This can be replaced by dynamically
 * generated data to adapt to other analyses.
 */
fun sampleMindMap(): Node {
    return Node(
        title = "Correlation Map",
        children = listOf(
            Node(
                title = "Policy chaos / Fed independence anxiety",
                children = listOf(
                    Node("Type of information", "Mainstream news + macro commentary (often repeated/expanded in market videos)"),
                    Node(
                        "Information itself",
                        "Investors reassessing US-policy stability; heightened concern around Fed independence and political pressure narratives"
                    ),
                    Node("Origin", "Reuters + Financial Times reporting"),
                    Node(
                        "Who",
                        "Attributed to investor/analyst commentary and reporting around Trump policy actions and Fed-related uncertainty"
                    ),
                    Node("Why", "To explain the broad USD weakness and risk-premium repricing across global assets"),
                    Node("When", "Jan 26–27, 2026"),
                    Node(
                        "Market reaction",
                        "UUP down -0.67%; FXE up +0.70%; EEM up +1.52% (31.2M vol); GLD up +0.60%"
                    )
                )
            ),
            Node(
                title = "EM rotation / record highs",
                children = listOf(
                    Node("Type of information", "Regional financial press + global asset‑manager outlook pieces"),
                    Node(
                        "Information itself",
                        "EM currencies/stocks reaching record highs as USD slides; investor rotation into EM"
                    ),
                    Node("Origin", "Moneyweb + Business Day reporting"),
                    Node(
                        "Why",
                        "To contextualize flows: weak USD and rotation lifts EM risk assets"
                    ),
                    Node("When", "Jan 23–27, 2026"),
                    Node(
                        "Market reaction",
                        "EEM +1.52% on heavy volume; EZA +0.62%; CEW slightly up"
                    )
                )
            ),
            Node(
                title = "Oil risk / upside tilt",
                children = listOf(
                    Node("Type of information", "Market analysis (often clipped into short videos)"),
                    Node("Information itself", "Near‑term crude risks tilted to the upside (technical + macro framing)"),
                    Node("Origin", "FOREX.com analysis post"),
                    Node("When", "Jan 27, 2026"),
                    Node("Market reaction", "USO +2.11% with ~3.21M volume")
                )
            )
        )
    )
}
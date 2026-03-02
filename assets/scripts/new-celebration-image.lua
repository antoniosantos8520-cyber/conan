-- Conan 2d20 Celebration Image Template
-- Creates a new image sized for Foundry VTT flex celebrations
-- Full-screen overlay matching Foundry minimum (1024x768)

local WIDTH = 1024
local HEIGHT = 768

-- Create new sprite with transparent background
local sprite = Sprite(WIDTH, HEIGHT, ColorMode.RGB)
sprite.filename = "celebration_layer"

-- Set up the first layer as our working layer
local layer = sprite.layers[1]
layer.name = "Celebration"

-- Clear to fully transparent
app.command.ClearCel()

-- Set up centered guides (optional visual aid)
-- Vertical center
sprite:newSlice{
  name = "center_v",
  bounds = Rectangle(WIDTH/2 - 1, 0, 2, HEIGHT),
  color = Color{ r=255, g=0, b=0, a=128 }
}
-- Horizontal center
sprite:newSlice{
  name = "center_h",
  bounds = Rectangle(0, HEIGHT/2 - 1, WIDTH, 2),
  color = Color{ r=255, g=0, b=0, a=128 }
}

-- Focus the sprite
app.activeSprite = sprite

-- Zoom to fit
app.command.FitScreen()

-- Notify user
app.alert{
  title = "Celebration Image Created",
  text = {
    "Size: " .. WIDTH .. "x" .. HEIGHT .. " pixels",
    "Color Mode: RGBA (transparent background)",
    "",
    "Tips:",
    "- Full-screen overlay - make it EPIC!",
    "- Save as PNG for transparency",
    "- Layer types: Battlecry, Effect, Attack, Impact",
    "- Consider glow/particle effects at edges"
  }
}

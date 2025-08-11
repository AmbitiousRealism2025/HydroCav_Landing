#!/bin/bash

# A reusable script to play a macOS system sound by name.
# Usage: ./alert.sh <sound_name>
# Example: ./alert.sh Funk

# Default sound if no argument is provided
DEFAULT_SOUND="Sosumi"
SOUND_NAME=${1:-$DEFAULT_SOUND}

# Construct the full path to the sound file
SOUND_PATH="/System/Library/Sounds/${SOUND_NAME}.aiff"

if [[ -f "$SOUND_PATH" ]]; then
  # Play the sound in the background if the file exists
  afplay "$SOUND_PATH" & disown
else
  # If the file doesn't exist, use 'say' to provide a spoken error alert
  say "Alert: Sound file named ${SOUND_NAME} not found." & disown
fi
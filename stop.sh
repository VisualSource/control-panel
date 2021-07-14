#!/bin/bash
# James Chambers - https://jamesachambers.com/minecraft-bedrock-edition-ubuntu-dedicated-server-guide/
# Minecraft Server stop script - primarily called by minecraft service but can be ran manually

# Set path variable
USERPATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/mnt/c/Users/Collin/AppData/Roaming/ActiveState/bin:/mnt/c/Windows/system32:/mnt/c/Windows:/mnt/c/Windows/System32/Wbem:/mnt/c/Windows/System32/WindowsPowerShell/v1.0/:/mnt/c/Windows/System32/OpenSSH/:/mnt/c/Program Files/Intel/WiFi/bin/:/mnt/c/Program Files/Common Files/Intel/WirelessCommon/:/mnt/c/Program Files/NVIDIA Corporation/NVIDIA NvDLISR:/mnt/c/Program Files (x86)/NVIDIA Corporation/PhysX/Common:/mnt/c/Users/Collin/.cargo/bin:/mnt/c/Users/Collin/AppData/Local/Microsoft/WindowsApps:/mnt/c/Users/Collin/AppData/Roaming/npm:/mnt/c/Users/Collin/AppData/Local/Programs/Microsoft VS Code/bin:/mnt/c/Users/Collin/.deno/bin:/mnt/c/Webprojects/node_control:/mnt/c/Users/Collin/AppData/Roaming/nvm:/mnt/c/Program Files/nodejs:/mnt/c/Program Files (x86)/Microsoft Visual Studio/2019/Community/VC/Tools/MSVC/14.27.29110/bin/Hostx64/x64/cl.exe:/mnt/c/Program Files/nodejs/:/mnt/c/Program Files/Git/cmd:/mnt/c/Program Files/webp/bin:/mnt/c/Program Files (x86)/Dr. Memory/bin/:/mnt/c/projects/bin/:/mnt/c/Users/Collin/AppData/Local/bin/NASM/:/mnt/c/Program Files/heroku/bin:/snap/bin"
PathLength=${#USERPATH}
if [[ "$PathLength" -gt 12 ]]; then
    PATH="$USERPATH"
else
    echo "Unable to set path variable."
fi

# Check if server is running
if ! screen -list | grep -q "\.GUI"; then
  echo "Server is not currently running!"
  exit 1
fi


# Wait up to 20 seconds for server to close
StopChecks=0
while [[ $StopChecks -lt 20 ]]; do
  if ! screen -list | grep -q "\.GUI"; then
    break
  fi
  sleep 1;
  StopChecks=$((StopChecks+1))
done

# Force quit if server is still open
if screen -list | grep -q "\.GUI"; then
  echo "GUI server still hasn't stopped after 20 seconds, closing screen manually"
  screen -S GUI -X quit
fi
FROM gitpod/workspace-full-vnc

# https://tauri.app/v1/guides/getting-started/prerequisites#setting-up-linux
RUN sudo apt update \
    && sudo apt install -yq libwebkit2gtk-4.0-dev \
        build-essential \
        curl \
        wget \
        file \
        libssl-dev \
        libgtk-3-dev \
        libayatana-appindicator3-dev \
        librsvg2-dev

# Behemoth Voxel Engine

Demonstração 3D de exploração e construção em voxels. Requer WebGL e internet para os CDNs. No desktop, use WASD, o mouse e E para o inventário; P ou Esc pausa. No celular, use os controles na tela.

## Rodar localmente

Na raiz do repositório, execute:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra <http://localhost:8000/>.

## Estrutura

`behemoth_voxel_engine (1).html`: motor e interface. `index.html`: entrada, sem remover a URL anterior.

A CI valida o HTML e verifica arquivos e âncoras locais. Links e serviços externos não são consultados pela CI.
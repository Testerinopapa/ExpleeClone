# Compressed reference captures

Publishing failed at the checkout step, before Vite ran. Offline visual captures accounted for approximately 2.9 GiB of project content. The unused page captures are now stored losslessly as `visual.json.gz`; the app does not import them. Screenshots, application data, and the introduction capture used by inspection scripts are unchanged.

To restore the captures locally for reference analysis:

```sh
python3 scripts/reference_captures.py restore
```

After analysis, remove the restored copies before publishing (compressed originals remain):

```sh
python3 scripts/reference_captures.py clean
```

No restore step belongs in the application build. Do not publish uncompressed reference captures.
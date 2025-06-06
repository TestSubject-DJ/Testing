# Testing
Experiments and Random Testing

## Website

`index.html` provides a small personal site for Gino Colombi. The page links to Spotify, Beatport and SoundCloud, and embeds players from both services. The photo gallery pulls images from remote URLs so no binary assets are stored in the repository.

## HTML Validation

This project may include HTML pages such as `index.html`. You can check for basic syntax issues using either the `tidy` utility or the `validate_html.py` script.

### Using tidy

Install tidy with:


```
sudo apt-get update
sudo apt-get install -y tidy
```

Then run:

```
tidy -errors index.html
```

### Using the Python script

Run the script with an optional filename. If no file is given it defaults to `index.html`:

```
python3 validate_html.py [file.html]
```

## Testing

Run the validation command:

```
tidy -errors index.html
# or
python3 validate_html.py
```

## Previewing Locally

You can preview the site in a browser without deploying it. From the repository root run:

```
python3 -m http.server
```

Then visit [http://localhost:8000/](http://localhost:8000/) in your browser.


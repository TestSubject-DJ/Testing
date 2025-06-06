# Testing
Experiments and Random Testing

## Website

`index.html` provides a profile page for DJ/producer **Gino Colombi**. It now includes a responsive navigation menu driven by a small JavaScript file and features a bold hero image. Embedded SoundCloud and Spotify players showcase the latest releases, while a grid-based gallery loads artwork and photos from Cloudinary.

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


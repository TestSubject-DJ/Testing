# Testing
Experiments and Random Testing

## Website

`index.html` provides a small personal site for Gino Colombi. The page links to Spotify, Beatport and SoundCloud, features embedded players from both services, and includes a photo gallery. Images are loaded from remote URLs, so you can replace them with your own by editing the `src` attributes in the HTML.

## HTML Validation

This project may include HTML pages such as `index.html`. You can check for basic
syntax issues using either the `tidy` utility or the `validate_html.py` script.

### Using tidy

Install tidy with:

```bash
sudo apt-get update
sudo apt-get install -y tidy

Then run:

bash
Copy
Edit
tidy -errors index.html

Using the Python script
Run the script with an optional filename. If no file is given it defaults to
index.html:

bash
Copy
Edit
python3 validate_html.py [file.html]
Testing
Run the validation command:

bash
Copy
Edit
tidy -errors index.html
# or
python3 validate_html.py
Previewing Locally
You can preview the site in a browser without deploying it. From the repository
root run:

bash
Copy
Edit
python3 -m http.server
Then visit http://localhost:8000/ in your browser.

vbnet
Copy
Edit

You can now copy and paste this directly into your `README.md` to fully replace its contents. Let me know if you'd like this formatted for GitHub-flavored Markdown or want any additions like badges or a TOC.
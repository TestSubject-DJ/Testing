# Testing
Experiments and Random Testing

## HTML Validation

This project may include HTML pages such as `index.html`. You can check for basic
syntax issues using either the `tidy` utility or the `validate_html.py` script.

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

```
python3 validate_html.py
```

## Testing

Run the validation command:

```
tidy -errors index.html
# or
python3 validate_html.py
```

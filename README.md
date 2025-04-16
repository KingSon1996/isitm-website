# ISITM Website Homepage

This is the implementation code for the homepage of the International Society of Innovation and Translational Medicine (ISITM) website. The website is built using HTML, CSS, and JavaScript, and runs through the Flask framework.

## Project Structure

```
/
├── app.py                # Flask application entry file
├── static/               # Static resource folder
│   ├── css/              # CSS style files
│   │   └── style.css     # Main style file
│   ├── js/               # JavaScript files
│   │   └── script.js     # Main script file
│   └── images/           # Image resource folder
└── templates/            # HTML template folder
    └── index.html        # Homepage template
```

## Image Requirements

Please place the following images in the `static/images/` directory, replacing them with actual image files:

- logo.png - ISITM Logo
- banner-group.jpg - Banner image (conference group photo)
- breakthrough-1.jpg, breakthrough-2.jpg, breakthrough-3.jpg - Scientific breakthrough section images
- translational-main.jpg - Translational medicine main image
- joseph-hill.jpg - Dr. Joseph Hill's photo
- meeting-1.jpg, meeting-2.jpg, meeting-3.jpg - Scientific meeting images
- member-1.jpg to member-8.jpg - Member profile photos
- partner-1.png to partner-6.png - Partner logos
- footer-logo.png - Footer logo

## Running Instructions

1. Make sure Python and Flask are installed:
   ```
   pip install flask
   ```

2. Place all image resources in the `static/images/` directory

3. Run the Flask application:
   ```
   python app.py
   ```

4. Open your browser and visit: `http://127.0.0.1:5000`

## Features

- Responsive design, adaptable to different screen sizes
- Smooth scrolling animation effects
- Interactive UI elements (buttons, card hover effects, etc.)
- Navigation bar scroll hide/show effect
- Fade-in effect for elements during scrolling

## Notes

- For best results, use high-quality images and maintain consistent image ratios
- You can adjust color and size parameters in the CSS as needed
- All interactive features are implemented using pure JavaScript, with no additional library dependencies 
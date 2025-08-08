# How to Add the Company Logo

This guide explains in simple terms how to add the HydroCav company logo to your website's navigation bar. We will not be writing the actual code right now, just outlining the steps.

---

### The Goal

Our goal is to replace the text "HydroCav" in the top-left corner of the website with an actual image of the company logo.

### Step 1: Create a Home for Your Logo

Think of this like creating a dedicated folder on your computer for pictures. A well-organized project is easier to manage.

1.  **Create an `assets` folder**: In your main project folder (`HYDROCAV_Website`), create a new folder and name it `assets`.
2.  **Create an `images` folder**: Inside that new `assets` folder, create another folder and name it `images`.
3.  **Add your logo**: Place your logo file (e.g., `logo.png` or `logo.svg`) inside the `assets/images/` folder.

After this, your folder structure will look like this:

```
HYDROCAV_Website/
|-- assets/
|   `-- images/
|       `-- your-logo-file.png
`-- index.html
```

### Step 2: Tell the Website Where to Find the Logo

Now, we need to edit the `index.html` file to tell it to display the image instead of the text.

1.  **Find the right line**: Open `index.html`. Near the top, you'll find the navigation bar code. We are looking for the line that currently displays the site name:

    ```html
    <a href="#" class="text-2xl font-bold text-slate-800">HydroCav</a>
    ```

2.  **Plan the change**: We will replace that line with an HTML `<img>` tag. This tag is specifically for displaying images. The new code would look something like this:

    ```html
    <a href="#">
        <img src="assets/images/your-logo-file.png" alt="HydroCav Company Logo">
    </a>
    ```

    *   `src=...`: This part tells the browser the path to the image file you added in Step 1.
    *   `alt=...`: This is the "alternative text." It's very important for accessibility, as it describes the image to screen readers or if the image fails to load.

### Step 3: Style the Logo

Finally, we'll need to make sure the logo is the right size. We can do this by adding some styling classes to the `<img>` tag.

The final version of the new code would look like this:

```html
<a href="#">
    <img src="assets/images/your-logo-file.png" alt="HydroCav Company Logo" class="h-8">
</a>
```

*   `class="h-8"`: This is a Tailwind CSS class that sets the height of the logo. The width will adjust automatically to keep the logo from looking stretched or squished.

---

Once you are ready to proceed with the code changes, I can implement these steps for you.
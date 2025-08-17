# Git Repository Setup Guide for HydroCav Website

## Overview
This guide will help you connect your local HydroCav website project to your remote GitHub repository at `https://github.com/AmbitiousRealism2025/HydroCav_Landing.git`.

## Prerequisites
- Git installed on your system
- Internet connection
- GitHub account credentials

## Step-by-Step Instructions

### 1. Initialize Local Git Repository
First, you need to initialize a git repository in your project directory:

```bash
cd /Users/ambrealismwork/Desktop/Coding Projects/HYDROCAV_Website
git init
```

### 2. Configure Git User Information
Set up your git user information (if not already configured):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Add Remote Repository
Connect your local repository to the remote GitHub repository:

```bash
git remote add origin https://github.com/AmbitiousRealism2025/HydroCav_Landing.git
```

### 4. Pull Existing Code (if any)
If there's existing code in the remote repository, pull it to avoid conflicts:

```bash
git pull origin main
```

Note: If the default branch is not `main`, use the appropriate branch name (e.g., `master`).

### 5. Review and Stage Files
Check the status of your files and stage them for commit:

```bash
git status
git add .
```

To be more selective about which files to add, you can add them individually:

```bash
git add index.html
git add assets/css/style.css
git add assets/js/main.js
# Add other files as needed
```

### 6. Commit Changes
Create a commit with a descriptive message:

```bash
git commit -m "Initial commit of HydroCav website project"
```

### 7. Push to Remote Repository
Push your changes to the remote repository:

```bash
git push -u origin main
```

Note: Use the `-u` flag to set the upstream branch for future pushes.

## Handling Potential Conflicts

If you encounter conflicts when pulling from the remote repository:

1. Resolve conflicts manually in the affected files
2. Stage the resolved files:
   ```bash
   git add .
   ```
3. Complete the merge:
   ```bash
   git commit -m "Resolve merge conflicts"
   ```

## Useful Git Commands

- Check repository status: `git status`
- View commit history: `git log --oneline`
- View differences: `git diff`
- Create a new branch: `git branch branch-name`
- Switch branches: `git checkout branch-name`
- Create and switch to a new branch: `git checkout -b branch-name`

## Branching Strategy

For a project of this size, consider using a branching strategy:

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `hotfix/*`: Hotfix branches

Example workflow:
```bash
git checkout -b feature/new-section
# Make changes
git add .
git commit -m "Add new section to homepage"
git checkout develop
git merge feature/new-section
git branch -d feature/new-section
```

## Best Practices

1. Make frequent, small commits with descriptive messages
2. Pull from remote before starting work to ensure you have the latest changes
3. Push changes regularly to backup your work
4. Use `.gitignore` to exclude unnecessary files (already present in your project)
5. Review changes before committing with `git diff`

## Troubleshooting

If you encounter issues:

1. Check remote configuration:
   ```bash
   git remote -v
   ```

2. Verify git configuration:
   ```bash
   git config --list
   ```

3. Reset last commit (if needed):
   ```bash
   git reset HEAD~1
   ```

## Next Steps

After completing the initial setup:

1. Continue developing your website
2. Make regular commits as you add features
3. Push changes to GitHub for backup and collaboration
4. Consider setting up GitHub Actions for automated testing and deployment

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Pro Git Book](https://git-scm.com/book/en/v2)
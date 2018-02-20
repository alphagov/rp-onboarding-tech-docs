# Verify technical documentation for connecting services

This is the technical documentation for government services connecting to GOV.UK Verify. It is [open to the public and published using GitHub pages](http://alphagov.github.io/rp-onboarding-tech-docs/).

A general overview of how a government service can connect to Verify is detailed in the the [Onboarding Guide](http://alphagov.github.io/identity-assurance-documentation/#) which is [published and managed separately](https://github.com/alphagov/identity-assurance-documentation). 

This project uses a documentation tool called [Sphinx](http://sphinx-doc.org/ "sphinx-doc") to convert content written in [reStructuredText](http://docutils.sourceforge.net/rst.html) into HTML. 

## Prerequisites 

To build the documentation locally you will need:
* [Git](https://help.github.com/articles/set-up-git) to manage versions (you may wish to install the [GitHub Desktop](https://desktop.github.com/) GUI)
* [Python 2.7](https://www.python.org/downloads/) to use Sphinx

If you're using a Mac, you should already have Python installed. You can check by running `python --version` in Terminal which should return which version of Python you have installed. For example, `Python 2.7.10`.  

To publish changes to the public documentation, you'll need access to Jenkins. Contact the Verify development team for access.

## Get a local copy of the files

Whilst it's possible to make changes directly to the content files using GitHub's built-in editing facilities, checking out the source materials to your local machine has the advantage that you can see any warnings generated when the source reStructuredText files are compiled into HTML. It's also the only way to add binary files such as images. 

Clone the repository using the command below.
```
git clone git@github.com:alphagov/rp-onboarding-tech-docs.git
```
...or if you're using the desktop client, pick File->Clone Repository and enter the URL: 
```
https://github.com/alphagov/rp-onboarding-tech-docs.git
```
 
## Install Sphinx 

Once you have Python up and running and a copy of the documentation files, you'll need to install the [Pip package manager](http://pip.readthedocs.org/en/stable/installing/), which will take care of fetching and installing the remaining dependencies. 

Run:

```
    curl https://bootstrap.pypa.io/get-pip.py > get-pip.py
    sudo chgrp -R admin /Library/Python/2.7/site-packages/
    sudo chmod -R g+w /Library/Python/2.7/site-packages/
    python get-pip.py
```

Then install the remaining dependencies using: 

```
    pip install -r requirements.txt
```
> If this fails, it is most likely due to a conflict with the "six" library. This can be cured by running:
>
> ```
>   pip install --ignore-installed six
> ```
>
> then re-running
> ```
>   pip install -r requirements.txt
> ```

### Create a branch 

Before editing any files, you should create a git branch so that your changes are bundled together and can later be merged by an editor (see 'pull requests' later):

Using the Git Desktop Client:
1. Click on "Current branch"
2. Enter `the-name-of-the-branch` you wish to create (see below for convention)
3. Click on the blue "Create new branch" button

Using the command line:
```
  git branch <the-name-of-the-branch>
```
Where `the-name-of-the-branch` should be a description of the changes you're making, usually a reference to the Jira ticket to which the change relates, e.g. "TT-1992-Revise-documentation". Note that you should not use spaces.


#### Editing pages
When editing or writing new content, you must follow the [GOV.UK style guide](https://www.gov.uk/guidance/style-guide). 

The documents must be in [reStructuredText](http://sphinx-doc.org/rest.html#rst-primer) format.

Edit the documentation in the `source` folder - this is the root folder for the reStructuredText documentation, which is used to build the HTML pages. You can then edit the documentation content. 

#### Previewing your work

You can preview any changes before you publish them. From the root folder, execute the following command:

```
make html
```

If there are any incompatible changes, the output will display warning messages to explain what has gone wrong. 

You can then open the output file in your browser from the `build/html/` folder to preview your changes. 

#### Committing your changes

Once you're happy with your changes, you'll need to commit them to this repository.

You can do this using the commands below or using the GitHub Desktop Client (by pressing the "Commit to <the-name-of-the-branch>" button at the bottom of the "changes" panel). 

```
git add .                                       # adds any new files to your git repo
git commit -m "<enter change description here>" # creates a new 'commit' which contains your changes
git push -u origin <the-name-of-the-branch>     # pushes your changes to your forked repository
```

> Any future changes you make on this branch can be pushed with just
> ```
> git push
> ```

## Sending the documentation for review

All changes to documentation must be reviewed before publishing.
This is done by issuing a **pull request**, which alerts subscribers to the repository that there is a change to be reviewed and *merged* into the master branch for publication.

1. Go to [the GitHub repository](https://github.com/alphagov/rp-onboarding-tech-docs). 
2. You should see your branch near the top of the page in a box labeled "Your recently pushed branches".
3. There will be a big green button next to it saying "Compare & pull request". Press that button.
4. Enter any (optional) comments and press the green "Create pull request" button.


## Publishing the documentation

Once accepted and merged into the *master* branch, your document(s) will be automatically placed in the [build pipeline](https://build.ida.digital.cabinet-office.gov.uk/view/rp-onboarding-tech-docs-pipeline/) and be automatically processed. 

Once built, your changes will be visible in the [published documentation](http://alphagov.github.io/rp-onboarding-tech-docs/). 

## Support and raising issues

If you think you have discovered a security issue in this code please email disclosure@digital.cabinet-office.gov.uk with details.

For non-security related bugs and feature requests please raise an issue in the [GitHub issue tracker](https://github.com/alphagov/rp-onboarding-tech-docs/issues).


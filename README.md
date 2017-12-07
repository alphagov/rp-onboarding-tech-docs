# Verify technical documentation for connecting services

This is the technical documentation for government services connecting to GOV.UK Verify. It is [open to the public and published using GitHub pages](http://alphagov.github.io/rp-onboarding-tech-docs/).

A general overview of how a government service can connect to Verify is detailed in the the [Onboarding Guide](http://alphagov.github.io/identity-assurance-documentation/#) which is [published and managed separately](https://github.com/alphagov/identity-assurance-documentation). 

This project uses a documentation tool called [Sphinx](http://sphinx-doc.org/ "sphinx-doc") to convert content written in [reStructuredText](http://docutils.sourceforge.net/rst.html) into HTML. 

## Prerequisites 

To build the documentation locally you will need:
* [Git](https://help.github.com/articles/set-up-git) to manage versions
* [Python](https://www.python.org/downloads/) to use Sphinx

If you're using a Mac, you should already have Python installed. You can check by running `python --version` in Terminal which should return which version of Python you have installed. For example, `Python 2.7.10`.  

To publish changes to the public documentation, you'll need access to Jenkins. Contact the Verify development team for access.

## Installation 

Once you have Python up and running, you'll need to install the [Pip package manager](http://pip.readthedocs.org/en/stable/installing/), which will take care of fetching and installing the remaining dependencies. 

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

## Making changes to the documentation

You can either make changes directly to the content files using GitHub's built-in editing facilities, or check out the source materials to your local machine. Working on a local copy has the advantage that you can see any warnings generated when the source reStructuredText files are compiled into HTML. It's also the only way to add binary files such as images. 

When editing or writing new content, you must follow the [GOV.UK style guide](https://www.gov.uk/guidance/style-guide). 

### Editing content 

This guide assumes you'll be working on the `master` branch of the repository. If you'd prefer to work separately, you can [fork this repository](https://help.github.com/articles/fork-a-repo) instead. 

 1. Clone the repository using the command below.
```
git clone git@github.com:alphagov/rp-onboarding-tech-docs.git
```
 2. Edit the documentation in the `source` folder - this is the root folder for the reStructuredText documentation, which is used to build the HTML pages. You can then edit the documentation content. The documents must be in [reStructuredText](http://sphinx-doc.org/rest.html#rst-primer) format.

#### Adding new pages

All documents must exist within a [toctree directive](http://sphinx-doc.org/markup/toctree.html) so users can navigate to the new files. Once you have decided where you want your new page, create the file and add it to the relevant toctree where you would like the user to be able to access the content. 

#### Previewing your work

You can preview any changes before you publish them. From the root folder `identity\_assurance\_documentation` execute the following command:

```
make clean html
```

If there are any incompatible changes, the output will display warning messages to explain what has gone wrong. 

You can then open the `build/html/index.html` file on your machine to preview your changes. 

#### Committing your changes

Once you're happy with your changes, you'll need to commit them to this repository.

You can do this using the commands below or using the GitHub UI. 

```
git add .                                       # adds any new files to your git repo
git commit -m "<enter change description here>" # creates a new 'commit' which contains your changes
git push origin master                          # pushes your changes to your forked repository
```

## Publishing the documentation

When you push changes to the master branch, a [Jenkins job](https://build.ida.digital.cabinet-office.gov.uk/job/rp-onboarding-tech-docs-build/) will automatically build the documentation. 

To publish, navigate to the [build pipeline](https://build.ida.digital.cabinet-office.gov.uk/view/rp-onboarding-tech-docs-pipeline/). 

You'll can then trigger another [Jenkins job](https://build.ida.digital.cabinet-office.gov.uk/job/rp-onboarding-tech-docs-publish/) to publish the changes onto GitHub pages. 

Your changes will be visible in the [published documentation](http://alphagov.github.io/rp-onboarding-tech-docs/). 

## Support and raising issues

If you think you have discovered a security issue in this code please email disclosure@digital.cabinet-office.gov.uk with details.

For non-security related bugs and feature requests please raise an issue in the [GitHub issue tracker](https://github.com/alphagov/rp-onboarding-tech-docs/issues).


Verify RP onboarding technical documentation
=

This is the technical documentation to accompany the [Onboarding Guide](http://alphagov.github.io/identity-assurance-documentation/).  It is published [here](http://alphagov.github.io/rp-onboarding-tech-docs/).

The guide is built automatically following a commit to master, and published to a [GitHub pages](https://pages.github.com/) repository by manually running another Jenkins job.  The build pipeline is [here](https://build.ida.digital.cabinet-office.gov.uk/view/rp-onboarding-tech-docs-pipeline)

This project utilizes [Sphinx](http://sphinx-doc.org/ "sphinx-doc") to convert [reStructuredText](http://docutils.sourceforge.net/rst.html) into HTML. There's a tutorial [here](http://sphinx-doc.org/tutorial.html).

# Making changes to the documentation

You can either make changes directly to files using Github's built-in editing facilities, or check out the source materials to your local machine.  Working on a local copy requires a bit of setup, but has the advantage that you can see any warnings generated when the source reStructuredText files are compiled into HTML.  It's also the only way to add binary files like images.  The rest of this section covers working with a local copy of the documentation and can be ignored if you plan to edit using the Github web interface.

## Installation

In order to fetch and build the documenation locally, you will need the following:

1. Git
1. Python

### Git

Git is the version control system used throughout Verify. Follow the instructions found [here](https://help.github.com/articles/set-up-git) to configure git on your machine. If you have no experience with Git you should ask someone for help.

### Python

Python is the programming language that Sphinx uses.  If you're using a Mac, it should already be installed, otherwise you can find installers [here](https://www.python.org/downloads/).  You can tell if it's installed by typing `python --version` which should produce something like `Python 2.7.10`.  

With Python up and running, we need to install the Pip package manager, which will take care of fetching and installing the remaining dependencies.  There are instructions [here](http://pip.readthedocs.org/en/stable/installing/) but it should be as simple as

```
    curl https://bootstrap.pypa.io/get-pip.py > get-pip.py
    sudo chgrp -R admin /Library/Python/2.7/site-packages/
    sudo chmod -R g+w /Library/Python/2.7/site-packages/
    python get-pip.py
```

Pip can then install the remaining dependencies for us:

```
    pip install -r requirements.txt
```

## Working with the documentation

This guide assumes you'll be working on the `master` branch of the repository.  If you're going to be working on a fork and submitting changes as pull requests, you'll need to create a fork (more information [here](https://help.github.com/articles/fork-a-repo) ) and work with that instead.

 1. Clone the repository using the command below.
```
git clone git@github.com:alphagov/rp-onboarding-tech-docs.git
```
 2. Edit the documentation in the _source_ folder - this is the root folder for the reStructuredText documentation, which is used to build the HTML pages of the guide.  At this point you can feel free to modify the documentation as you see fit.  The documents must be in [reStructuredText](http://sphinx-doc.org/rest.html#rst-primer) format.

### New pages

All documents must exist within a [toctree directive](http://sphinx-doc.org/markup/toctree.html) or there will be warnings generated within the compile and the files won't be navigable.  Once you have decided where you want your new page create the file and add it to the relevant toctree where you would like the user to be able to navigate to your new file.

### Previewing your work

Once you have completed your changes you are going to want to build and preview your changes. This will ensure that you haven't made any mistakes. From the root folder identity\_assurance\_documentation execute the following command:

```
make clean html
```

If the output of that command contains any WARNING messages you have done something wrong and will need to fix your changes. When you have successfully generated the documentation it will be available in build/html and you can open the file build/html/index.html in order to preview your changes.

### Committing your changes

Commit and push your changes as with any git repository

```
git add .                                       # adds any new files to your git repo
git commit -m "<enter change description here>" # creates a new 'commit' which contains your changes
git push origin master                          # pushes your changes to your forked repository
```

# Publishing the guide

To see previews of the documentation, and trigger publication (should only be done by the person with responsibility for publishing the guide), you need an account on our Continuous Integration server, Jenkins, which lives [here](https://build.ida.digital.cabinet-office.gov.uk/)

When changes are pushed to the master branch, a [Jenkins job](https://build.ida.digital.cabinet-office.gov.uk/job/rp-onboarding-tech-docs-build/) is automatically triggered to build the documentation.  The output of the build is then available as a preview in the workspace of the job [here](https://build.ida.digital.cabinet-office.gov.uk/job/rp-onboarding-tech-docs-build/ws/build/html/index.html).  Note that this is the same as the output generated when you build the documentation locally as described above.

Publishing is performed by triggering (from [the build pipeline](https://build.ida.digital.cabinet-office.gov.uk/view/rp-onboarding-tech-docs-pipeline/)) another [Jenkins job](https://build.ida.digital.cabinet-office.gov.uk/job/rp-onboarding-tech-docs-publish/) which commits the output of the build job to the gh-pages branch of a [github.com repository](https://github.com/alphagov/rp-onboarding-tech-docs), making it visible to the public [here](http://alphagov.github.io/rp-onboarding-tech-docs/).  

The [build pipeline](https://build.ida.digital.cabinet-office.gov.uk/view/rp-onboarding-tech-docs-pipeline) provides an overview of the build and publish steps, and is also the easiest way to trigger the publication step, as this requires a build number from the previous build step.

Note that, because the repository itself is private, and we haven't publicised the link to the Github Pages site (http://alphagov.github.io/rp-onboarding-tech-docs), the documentation won't be discoverable.  When it's published for the first time and the URL is made public, the github.com repository can be made public, since it only contains the generated HMTL.

## Additional Details

We are going to try to stick to the gov.uk style guide: https://www.gov.uk/design-principles/style-guide/style-points

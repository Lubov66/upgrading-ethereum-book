#!/usr/bin/perl

# Strips markdown stuff from the input file to prepare for spell checking.
# To preserve line numbers, we keep all lines and prefix every output line with a `^`

use strict;
use warnings;

$\ = "\n"; # set output record separator

my $inCode = 0;
my $inMath = 0;
my $inComment = 0;

while(<>) {

    # Code blocks
    if (/^```/) {
        $inCode = 1 - $inCode;
        print '^';
        next;
    }

    # LaTeX blocks
    if (/^\$\$/) {
        $inMath = 1 - $inMath;
        print '^';
        next;
    }

    # Multi-line HTML comments
    if (/^<!--$/) {
        $inComment = 1;
        print '^';
        next;
    }

    if (/^\s*-->$/) {
        $inComment = 0;
        print '^';
        next;
    }

    if ($inMath or $inCode or $inComment) {
        print '^';
        next;
    }

    chomp;

    # Block quotations
    s/^ *>.*$//;

    # Footnote links
    s/\[\^.+?\]:?//g;

    # Markdown link stuff
    s/^\[//g;
    s/[ !"\(]\[/ /g;
    s/\]\(.+?\)//g;

    # Backticked text
    s/`.+?`//g;

    # Inline maths
    s/\$.+?\$//g;

    # Heading prefixes
    s/^#+ //g;

    # HTML comments
    s/<!-- .*? -->//g;

    # HTML tags
    s/<.+?>//g;

    # HTML entities
    s/&.+?;/ /g;

    # Anything in quote marks
    s/".+?"//g;

    print "^ $_";
}

die "Code block not closed!" unless $inCode == 0;
die "Math block not closed!" unless $inMath == 0;
die "HTML comment not closed!" unless $inComment == 0;

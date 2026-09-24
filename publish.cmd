@echo off
REM ===========================================================================
REM  SAVE AND PUBLISH
REM ---------------------------------------------------------------------------
REM  Run this after editing the website:
REM
REM     .\publish "what you changed"
REM
REM  Saves your work to GitHub, then puts the site live. Add --check to see
REM  what it would do without doing it.
REM ===========================================================================
node "%~dp0scripts\publish.mjs" %*

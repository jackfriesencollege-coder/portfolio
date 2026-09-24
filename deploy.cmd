@echo off
REM ===========================================================================
REM  PUBLISH THE SITE
REM ---------------------------------------------------------------------------
REM  Run this from the project folder:   .\deploy
REM
REM  This exists because PowerShell refuses to run npm by default (npm is a
REM  .ps1 script, and Windows blocks those unless you change a security
REM  setting). A .cmd file is not affected, so this always works.
REM
REM  Add --check to verify the setup without publishing:   .\deploy --check
REM ===========================================================================
node "%~dp0scripts\deploy.mjs" %*

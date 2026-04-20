@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script, version 3.3.1
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET "BASE_DIR=%~dp0")

@SET MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%
@IF NOT "%MAVEN_BASEDIR%"=="" GOTO skipSearchMavenBasedir

@SET MAVEN_PROJECTBASEDIR=%BASE_DIR%
@CD /D "%BASE_DIR%"

:findBaseDir
@IF EXIST "%BASE_DIR%.mvn" GOTO baseDirFound
@CD ..
@IF "%CD%"=="%BASE_DIR%" GOTO baseDirNotFound
@SET "BASE_DIR=%CD%"
@GOTO findBaseDir

:baseDirFound
@SET MAVEN_PROJECTBASEDIR=%BASE_DIR%
@GOTO continue

:baseDirNotFound
@ECHO "Unable to find Maven wrapper (.mvn directory)"
@EXIT /B 1

:skipSearchMavenBasedir
:continue

@SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

@SET DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.1/maven-wrapper-3.3.1.jar"

@FOR /F "usebackq tokens=1,2 delims==" %%A IN ("%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties") DO (
    @IF "%%A"=="wrapperUrl" SET DOWNLOAD_URL=%%B
)

@IF EXIST %WRAPPER_JAR% (
    @SET MVN_CMD="%JAVA_HOME%\bin\java" -classpath %WRAPPER_JAR% %WRAPPER_LAUNCHER% %MAVEN_CONFIG% %*
) ELSE (
    @ECHO Downloading Maven Wrapper from: %DOWNLOAD_URL%
    @"%JAVA_HOME%\bin\java" -classpath "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper" \
        org.apache.maven.wrapper.DefaultDownloader "%DOWNLOAD_URL%" "%WRAPPER_JAR%"
    @SET MVN_CMD="%JAVA_HOME%\bin\java" -classpath %WRAPPER_JAR% %WRAPPER_LAUNCHER% %MAVEN_CONFIG% %*
)

@%MVN_CMD% %*

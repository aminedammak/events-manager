<?php
if (!defined ('TYPO3_MODE')) die ('Access denied.');

\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
    'EventsManager' . $_EXTKEY,
    'User_theme plugin name',
    array(
    )
);

\FluidTYPO3\Flux\Core::registerProviderExtensionKey('usertheme', 'Content');
\FluidTYPO3\Flux\Core::registerProviderExtensionKey('usertheme', 'Page');
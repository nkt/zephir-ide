<?php

$outDir = __DIR__ . '/../stubs/functions';

$functions = get_defined_functions()['internal'];
$result = [];

foreach ($functions as $name) {
  $refl = new ReflectionFunction($name);
  $ext = $refl->getExtensionName();
  if (!isset($result[$ext])) {
    $result[$ext] = [];
  }

  $name = $refl->getName();
  $url = str_replace('_', '-', $name);

  $result[$ext][] = [
    'name' => $name,
    'type' => 'mixed',
    'url' => 'http://php.net/manual/ru/function.' . $name . '.php',
    'args' => array_map(function($param) {
      return [
        'name' => $param->getName(),
        'type' => 'mixed'
      ];
    }, $refl->getParameters())
  ];
}

foreach ($result as $ext => $functions) {
  usort($result[$ext], function($a, $b) {
    return strcmp($a['name'], $b['name']);
  });

  file_put_contents($outDir . '/' . $ext . '.json', json_encode($functions, JSON_PRETTY_PRINT));
}

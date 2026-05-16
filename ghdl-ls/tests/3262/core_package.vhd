library ieee;
use ieee.std_logic_1164.all;

library mylib;
use mylib.misc_utils_package.all;

package core_package is

  constant CONST : std_logic_vector(log2(4) -1 downto 0);

end package ;

beam_response = lambda load_type, L, load_value, E, I: (load_value * L * L / 8, load_value * L / 2, 5 * load_value * L * L * L * L / 384 / E / I) if load_type == 'udl' else ((load_value * L / 4, load_value / 2, load_value * L * L * L / 48 / E / I) if load_type == 'point' else (_ for _ in ()).throw(ValueError('load_type must be udl or point')))
load_type = 'udl'
L = 6.0
load_value = 12.0
E = 210000000.0
I = 0.0003
M, V, delta_max = beam_response(load_type, L, load_value, E, I)
print('Load type:', load_type)
print('Span:', L, 'm')
print('Load value:', load_value)
print('E:', E, 'kN/m^2')
print('I:', I, 'm^4')
print('Max moment:', round(M, 2), 'kN.m')
print('Max shear:', round(V, 2), 'kN')
print('Max deflection:', round(delta_max, 6), 'm')

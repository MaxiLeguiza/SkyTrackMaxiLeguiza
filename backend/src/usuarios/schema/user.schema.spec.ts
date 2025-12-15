import { hashPassword } from './usuarios.schema';
import * as bcrypt from 'bcrypt';

describe('UsersSchema', () => {
  it('Se hashea la contraseña', async () => {
    const plain = '123456';
    const hashed = await hashPassword(plain);

    expect(hashed).not.toBe(plain);
    expect(await bcrypt.compare(plain, hashed)).toBe(true);
  });
});

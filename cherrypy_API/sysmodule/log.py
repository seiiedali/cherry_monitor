import os


def read_log_file(file_name, direction='tail', line_count='100'):
    LOG_PATH = os.path.join('/', 'var', 'log')
    file_lines = []
    int_count = int(line_count)
    file_path = os.path.join(LOG_PATH, file_name)
    read_direction = 1

    with open(file_path, 'r') as log_file:
        lines_list = log_file.readlines()
        start_index = 0
        end_index = len(lines_list)
        if len(lines_list) >= int_count:
            if direction == 'tail':
                start_index = - 1
                end_index = -1 * (int_count + 1)
                read_direction = -1
            elif direction == 'head':
                start_index = 0
                end_index = int_count
            file_lines = [
                line for line in lines_list[start_index:end_index:read_direction]]
        else:
            file_lines = lines_list

        parsed_log = {}
        print(len(file_lines))
        for log_index, line in enumerate(file_lines):
            parsed_log[log_index] = line.split()
        print(start_index, end_index)
    return parsed_log

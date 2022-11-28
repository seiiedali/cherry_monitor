import os


def read_log_file(file_name, direction='head', line_count='100'):
    LOG_PATH = os.path.join('/', 'var', 'log')
    file_lines = []
    int_count = int(line_count)
    file_path = os.path.join(LOG_PATH, file_name)

    with open(file_path, 'r') as f:
        lines_list = f.readlines()
        start_index = 0
        end_index = len(lines_list)
        if len(lines_list) >= int_count:
            if direction == 'tail':
                start_index = len(lines_list) - int_count - 1
                end_index = len(lines_list) - 1
            elif direction == 'head':
                start_index = 0
                end_index = int_count - 1
            file_lines = [line for line in lines_list[start_index:end_index]]
        else:
            file_lines = lines_list
        
        parsed_log = []
        for line in file_lines:
            parsed_log += line.split()
    return parsed_log

print(read_log_file('syslog', 'head', '100'))